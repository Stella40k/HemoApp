import {User} from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js"

export const register = async(req, res)=>{
    try {
        const{email, password, coordinates}= req.body;
        
        //validar si ya existe el usuario
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                ok: false,
                error: "El usuario ya existe"
            });
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

        //validacion por si es institucion
        if(role === 'institution'){
            userData.role = 'institution';
            userData.institutionName = institutionName;
            userData.cuit = uit;
            userData.isInstitution = true;
        }else{
            userData.role = 'donor';
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
                role: user.role,
                coordinates: userData.location.coordinates,
                ... (user.role === 'institution' && {
                    institutionName: user.institutionName,
                    cuit: user.cuit
                })
            }
        });
    } catch (error) {
        if(error.name === 'ValidationError'){
            const errors = Object.values(error.errors).map(err=> err.message);
            return res.status(400).json({
                ok: false,
                msg: "Error de validaiones",
                details: errors
            });
        }
        if(error.code === 11000){
            return res.status(400).json({
                ok: false,
                error: "Email ya registrado"
            });
        }
        res.status(500).json({
            ok: false,
            msg: "Ups! Error interno del servidor",
            details: process.env.NODE_ENV === 'development'? error.message: "Contacte al administrador"
        });
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
                role: user.role,
                bloodType: user.bloodType,
                coordinates: user.location.coordinates,
                status: user.status,
                ... (user.role === 'institution' &&{
                    institutionName: user.institutionName,
                    cuit: user.cuit
                })
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Ups! Ocurrio un error en el servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
        });
    }
};
export const logout = (req, res)=>{
    res.json({
        ok: true,
        msg:"Logout exitoso"
    });
};