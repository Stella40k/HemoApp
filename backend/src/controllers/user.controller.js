import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js"

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
}; //modificar en donde se exporte User -> UserByID
export const UserByID = async(req, res)=>{
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
        const{email, bloodType, coordinates, status, inactivetyReason} = req.body;
        const user = await User.findByIdAndUpdate(
            re.params.id,
            {email, bloodType, coordinates, status, inactivetyReason},
            { new: true, runValidators: true}
        );
        if(!user){
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }
        res.status(200).json({
            ok: true,
            msg:"Usuario actualizado",
            data: user
        });
    } catch (error) {
       res.status(500).json({
        ok: false,
        msg: "Error al actualizar el usuario",
        data: error
       });
    }
};
//eliminacion logica del user
export const deactivateUser = async(req, res)=>{
    try {
       const user = await User.findByIdAndUpdate(
        req.params.id,
        //Descansando es para avisar que el usuario no esta en momento de donar, pero podria seguir
        //activo en la app, ver como se vera esto o como hacer esto
        {status: "Descansando", inactivetyReason: req.body.reason || "Desactivado por admin"},
        { new: true}
       );
       if(!user){
        return res.status(404).json({
            ok: false,
            msg: "Usuario no encontrado"
        });
       }
       res.status(200).json({
        ok: true,
        msg: "Usuario desactivado",
        data: user
       });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al desactivar el usuario",
            data: error
        });
    }
};