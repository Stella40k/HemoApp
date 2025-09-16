import { User } from "../models/user.model.js";

export const getUsers = async(req, res)=>{
    try {
        const users = await User.find();
        if(users.length ===0){
            return res.status(200).json({
                ok: true,
                msg: "No hay usuarios registrados todavia",
            });
        }
        res.status(200).json({
            ok: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg:"Ups! Ocurrio un error",
            data: error
        });
    }
};
export const User = async(req, res)=>{
    try {
        const user = await User.FindById(req.params.id);
        if(!user){
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }
        res.status(200).json({
            ok: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al buscar el usuario",
            data: error
        });
    }
};
export const updateUser = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
};
export const deactivateUser = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
};