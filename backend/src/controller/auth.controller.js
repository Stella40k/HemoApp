import { userModel } from "../models/user.model.js";
import { generateToken, verifyToken, generateTokenRefresh } from "../helpers/jwt.helper.js";
import { hashedPassword ,comparePasswords } from "../helpers/bcrypt.helper.js";
import { generateSecureToken } from "../helpers/crypto.helper.js";
import { emailService } from "../services/email.service.js";
//MODIFICAR LA VERIFICACION DE LA CUENTA!!!

export const register = async(req, res)=>{
    try {
        const{userName, email, password, role, profileData} = req.body;
        const existUser = await userModel.findOne({
            $or: [{email}, {userName}]
        });
        if(existUser){
            return res.status(400).json({
                ok: false,
                msg: "Usuario o email ya existente"
            });
        }
        const passwordHash = await hashedPassword(password);
        const emailVerificationToken = generateSecureToken();
        const newUser = new userModel({
            userName, 
            email,
            password: passwordHash,
            role: role || 'community_member',
            accountStatus: 'unverified', //estado de cuenta
            donationStatus: 'inactive',
            emailVerificationToken,
            emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
            profile:{
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                birthDate: profileData.birthDate,
                gender: profileData.gender,
                bloodType: profileData.bloodType || null,
                factor: profileData.factor || null,
                dni: profileData.dni
            }
        });
        await newUser.save();
        try {
            await emailService.sendVerificationEmail(email, emailVerificationToken);
        } catch (error) {
            console.log("usuario creado pero email invalido", emalError)
        }
        //nueva parte para la verificacion del mail
        return res.status(201).json({
            ok: true,
            msg: "Registro exitoso! Por favor, confirmar email ",
            data: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role,
                accountStatus: newUser.accountStatus,
                profile:{
                    firstName: newUser.profile.firstName,
                    lastName: newUser.profile.lastName,
                    dni: newUser.profile.dni,
                    birthDate: newUser.profile.birthDate
                }
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Ups! Ocurrio un error al registrar el usuario",
            error: error.message
        })
    }
}

export const login = async(req, res)=>{
    try {
        const{userName, email, password} = req.body;
        const user = await userModel.findOne({
            $or: [{userName}, {email}]
        }).select('+password');
        if(!user){
            return res.status(401).json({
                ok: false,
                msg: "Credenciales invalidas"
            });
        }
        const isPasswordValid = await comparePasswords(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                ok: false,
                msg: "credenciales incorrectas"
            });
        }
        if(!user.emailVerified || user.accountStatus !== "verified"){
            return res.status(401).json({
                ok: false,
                msg: "Cuenta no verificada. Por favor verificar el email"
            });
        }
        const accessToken = generateToken(user);
        const refreshToken = generateTokenRefresh(user)

        //para guardar la token refrescada en la bd
        user.refreshToken = refreshToken
        await user.save()

        return res.status(200).json({
            ok: true,
            msg: "Logueado correctamente, bienvenido!",
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    accountStatus: user.accountStatus,
                    donationStatus: user.donationStatus
                }
            }
        });
    } catch (error) {
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno en el servidor"
        });
    }
};
export const getMyProfile = async(req, res)=>{
    try {
        const userId = req.user._id //viene la info del token
        const myProfile = await userModel.findById(userId).select("-password -refreshToken");
        res.status(200).json({
            ok: true,
            data: myProfile
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Ups! ocurrio un error",
            error: error.message
        })
    }
};
export const logout = async(req, res)=>{
    try {
        const userId = req.user._id;
        await userModel.findByIdAndUpdate(userId, {
            refreshToken: null
            //$unset: {refreshToken: 1} elimina todo el campo, activar cuando deje de probar
        });
        return res.status(200).json({
            ok: true,
            msg: "Sesion cerrada"
        })
    } catch (error) {
        console.log("Error al cerrar la sesion", error);
        return res.status(500).json({
            ok: false,
            msg: "Ups! Error al querer cerrar sesion",
            error: error.message
        });
    }
};
export const refreshToken = async(req, res)=>{
    try {
        const user = req.user;
        const newAccesToken = generateToken(user);
        const newRefreshToken = generateTokenRefresh(user);

        //actualizar el refhesh
        user.refreshToken = newRefreshToken;
        await user.save()

        return res.status(200).json({
            ok:true,
            msg: "Token actualizado correctamente",
            data: {
                accessToken: newAccesToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        console.log("eeror al refrescar la token", error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor: fallo en refresh Token"
        });
    }
};
export const verifyEmail = async(req, res)=>{
    try {
        const {token} = req.params;
        const user = await userModel.findOne({
            emailVerificationToken: token, 
            emailVerificationExpires: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: "Token de verificacion invalido o expirado"
            });
        }
        //PARA ACTIVAR LA CUENTA (NO DISPONIBILIDAD DE DONACION)
        user.accountStatus = 'verified';
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();
        return res.status(200).json({
            ok: true,
            msg: "Email verificado con exitos, ya puede iniicar sesion y donar",
            data: {
                id: user._id,
                userName: user.userName,
                accountStatus: user.accountStatus
            }
        });
    } catch (error) {
        console.log("error en la verificacion del mail", error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servir, fallo la verificacion del mail"
        })
    };
};