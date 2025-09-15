import {User} from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"

export const register = async(req, res)=>{
    try {
        const{email, password, coordinates}= req.body;
        
        //validar si ya existe el usuario
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({error: "El usuario ya existe"})
        }
    } catch (error) {
        
    }
}