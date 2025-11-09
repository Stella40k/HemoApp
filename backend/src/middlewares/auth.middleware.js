import { verifyToken } from "../helpers/jwt.helper.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log("la token", token);
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "Token de acceso requerido. No autorizado.",
      });
    }

    const decoded = verifyToken(token);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encpntrado",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      ok: false,
      msg: "Token invalido o expirado",
    });
  }
};
export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        msg: "Refresh del token requerido",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        ok: false,
        msg: "Refresh del token invalido",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      ok: false,
      msg: "Refresh token inválido o expirado",
    });
  }
};
