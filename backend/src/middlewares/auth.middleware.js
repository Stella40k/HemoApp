import { verifyToken } from "../helpers/jwt.helper.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const validateToken =async (req, res, next)=>{
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userLog = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: "Token invalido: usuario no logueado"
        });
    }
};

export const authenticateToken = async (req, res, next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

        if(!token){
            return res.status(401).json({
                ok: false,
                msg: "Token de acceso requerido"
            });
        }
        const decoded = verifyToken(token);
        const user = await userModel.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: "Token invalido o expirado"
        });
    }
};
export const validateRefreshToken = async(req, res, next)=>{
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(401).json({
                ok: false,
                msg: "Refresh del token requerido"
            });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: "Refresh token inválido o expirado"
        });   
    }
};