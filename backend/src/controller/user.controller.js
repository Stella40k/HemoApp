import { userModel } from "../models/user.model.js";

export const updateUser = async(req, res)=>{
    try {
        const{userName, email, password, role, status} = req.body;
        const updateData = await userModel.findByIdAndUpdate(
            req.params.id, {
                $set:{
                    userName, email, password, role, status
                }
            },
            {new: true}     
        )
        res.status(201).json({
            ok: true,
            msg: "Usuario actualizado con exito!",
            data: updateData
        });
    } catch (error) {
        console.log(error)
    }
};