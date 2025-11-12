import { userModel } from "../models/user.model.js";
import { generateToken, verifyToken } from "../helpers/jwt.helper.js";
import { comparePasswords } from "../helpers/bcrypt.helper.js";
import { RegistrationService } from "../services/registration.service.js";
import { envs } from "../config/config.env.js";

//MODIFICAR LA VERIFICACION DE LA CUENTA!!!

export const register = async (req, res) => {
  try {
    const { userName, email, password, role, profileData, institutionData } =
      req.body;
    const result = await RegistrationService.registerUser({
      userName,
      email,
      password,
      role,
      profileData,
      institutionData,
    });
    const message = result.isInstitution
      ? "Registro exitoso. La institucion esta en proceso de validacion."
      : "Registro eexitoso: Por favor, verifica tu bandeja de entrada de email.";

    return res.status(201).json({
      ok: true,
      msg: message,
      data: {
        id: result.user._id,
        userName: result.user.userName,
        email: result.user.email,
        role: result.user.role,
        accountStatus: result.user.accountStatus,
        ...(result.isInstitution && {
          institutionStatus: "pending_validation",
        }),
        profile: result.user.profile
          ? {
              firstName: result.user.profile.firstName,
              lastName: result.user.profile.lastName,
              dni: result.user.profile.dni,
              birthDate: result.user.profile.birthDate,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.log("error en registro", error);
    res.status(400).json({
      ok: false,
      msg: "Ups! Ocurrio un error al registrar el usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const user = await userModel
      .findOne({
        $or: [{ userName }, { email }],
      })
      .select("+password");
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales invalidas",
      });
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        msg: "credenciales incorrectas",
      });
    }
    if (user.role === "institucion") {
      if (user.accountStatus === "pending_validation") {
        return res.status(401).json({
          ok: false,
          msg: "La institucion esta en proceso de validacion. Te notificaremos cuando sea aprobada",
        });
      }
    }
    if (!user.emailVerified || user.accountStatus !== "verified") {
      return res.status(401).json({
        ok: false,
        msg: "Cuenta no verificada. Por favor verifica tu email o espera la aprobación del moderador.",
      });
    }
    const Token = generateToken(user);
    //parte para la auditoria
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.Token = Token;
    await user.save();
    res.cookie("accessToken", Token, {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({
      ok: true,
      msg: "Logueado correctamente, bienvenido!",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          donationStatus: user.donationStatus,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id; //viene la info del token
    const myProfile = await userModel
      .findById(userId)
      .select("-password -Token");
    res.status(200).json({
      ok: true,
      data: myProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Ups! ocurrio un error",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    // Limpiar tokens en la base de datos
    await userModel.findByIdAndUpdate(userId, {
      Token: null,
      refreshToken: null,
      lastLogout: new Date(),
    });

    // Limpiar todas las cookies relacionadas con autenticación
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expira inmediatamente
    });

    // También limpiamos el refresh token si existe
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    // Invalidar la sesión si estás usando sessions
    if (req.session) {
      req.session.destroy();
    }

    return res.status(200).json({
      ok: true,
      msg: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.log("Error al cerrar la sesion", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al cerrar sesión",
      error: error.message,
    });
  }
};
// export const refreshToken = async(req, res)=>{
//     try {
//         const user = req.user;
//         const newAccesToken = generateToken(user);
//         const newRefreshToken = generateTokenRefresh(user);

//         //actualizar el refhesh
//         user.refreshToken = newRefreshToken;
//         await user.save()

//         return res.status(200).json({
//             ok:true,
//             msg: "Token actualizado correctamente",
//             data: {
//                 accessToken: newAccesToken,
//                 refreshToken: newRefreshToken
//             }
//         });
//     } catch (error) {
//         console.log("eeror al refrescar la token", error);
//         return res.status(500).json({
//             ok: false,
//             msg: "Error interno del servidor: fallo en refresh Token"
//         });
//     }
// };
export const verifyEmail = async (req, res) => {
  try {
    // El token llega por params porque el enlace apunta al BACKEND.
    // Verificamos y luego redirigimos al FRONTEND sin exponer el token en la URL.
    const { token } = req.params;
    const user = await userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    console.log("user", user);
    if (!user) {
      // Redirigir al frontend a una página de fallo de verificación
      const failUrl = `${envs.FRONTEND_URL}/verify-failed`;
      return res.redirect(failUrl);
    }

    // ACTIVAR LA CUENTA (NO DISPONIBILIDAD DE DONACION)
    user.accountStatus = "verified";
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    //generacion de tokens para un login automatico despues de validar email
    const accessToken = generateToken(user);
    const refreshToken = generateTokenRefresh(user);
    user.Token = accessToken;
    user.refreshToken = refreshToken;

    await user.save();

    //establecer cookies seguras para el autologin
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hora
    });

    // Redirigimos al frontend a una ruta de confirmación limpia (sin token)
    const successUrl = `${envs.FRONTEND_URL}/onboarding`;
    console.log("user1", successUrl);
    return res.redirect(successUrl);
  } catch (error) {
    console.log("error en la verificacion del mail", error);
    // En caso de error redirigimos a la página de fallo del frontend
    const failUrl = `${envs.FRONTEND_URL}/verify-failed`;
    return res.redirect(failUrl);
  }
};
