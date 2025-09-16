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

        //crear un nuevo usuario con ubicacuon
        const userData = await User.create({
            email,
            passwordHash: password,
            location:{
                type: "Point",
                coordinates: coordinates || [0, 0] //[longi, latit]
            }
        });

        if(role === 'institution'){
            userData.role = 'institution';
            userData.institutionName = req.body.institutionName;
            userData.cuit = req.body.cuit;
            userData.isInstitution = true;
        }
        const user = await User.create(userData);
        
        //generacion de JWT
        const token = generateToken(User._id);
        res.status(201).json({
            ok: true,
            msg: "Usuario registrado",
            token,
            user:{
                id: userData._id,
                email: userData.email,
                coordinates: userData.location.coordinates
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Ups! Error interno del servidor",
        })
    }
};
export const login = async(req, res)=>{
    try {
        const{email, password}= req.body;
        
        //buscamos el user y verificamos credenciales
        const user = await User.findOne({ email });
        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({
                ok: false,
                error: "Credenciales incorrectas",
            });
        }

        //generamos un nuevo token
        const token = generateToken(user._id);
        res.json({
            ok: true,
            msg: "Login exitoso",
            token,
            user:{
                id: user._id,
                email: user.email,
                bloodType: user.bloodType,
                coordinates: user.location.coordinates,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Ups! Ocurrio un error en el servidor",
            error: error.message
        });
    }
};
export const logout = (req, res)=>{
    res.json({
        ok: true,
        msg:"Logout exitoso"
    });
};