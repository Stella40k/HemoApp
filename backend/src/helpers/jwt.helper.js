import jwt from "jsonwebtoken";

export const generateToken =(user)=>{
    try {
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        return token;
    } catch (error) {
        console.log("Error al general el token", error);
        throw new Error("Error al generar el token del usuario");
    }
};
export const verifyToken =(token)=>{
    try {
        const decoded = jwt.verify.apply(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.log("error al verificar el token");
        throw new Error("Token invalido o expirado");
    }
};