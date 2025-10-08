import { userModel } from "../models/user.model,js";
//Falta el token y el hasheo!!!
export const register = async(req, res)=>{
    try {
        const{userName, email, password, role, status, profileData} = req.body;
        const existUser = await userModel.findOne({
            $or: [{email}, {userName}]
        });
        if(existUser){
            return res.status(400).json({
                ok: false,
                msg: "Usuario o email ya existente"
            });
        }
        const newUser = new userModel({
            userName, 
            email,
            password,//: hashedPassword,
            role: role || 'community_member',
            status: status || 'inactive',
            profile:{
                firtsName: profileData.firtsName,
                lastName: profileData.lastName,
                birthDate: profileData.birthDate,
                gender: profileData.gender,
                bloodType: profileData.bloodType || null,
                factor: profileData.factor || null
            }
        });
        await newUser.save();
        return res.status(201).json({
            ok: true,
            msg: "Bienvenido! ",
            data: newUser
        });
    } catch (error) {
        //console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Ups! Ocurrio un error al registrar el usuario"
        })
    }
}

export const getMyProfile = async(req, res)=>{
    try {
        const userId = req.user._id //viene la info del token
        const myProfile = await userModel.findById(userId).select("-password");
        res.status(200).json({
            ok: true,
            data: myProfile
        })
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Ups! ocurrio un error"
        })
    }
};

export const login = async(req, res)=>{
    try {
        const{userName, email, password} = req.body;
        const user = await userModel.findOne({
            userName
        });
        return res.status(200).json({
            ok: true,
            msg: "Logueado correctamente, bienvenido!"
        });
    } catch (error) {
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno en el servidor"
        });
    }
};

export const logout = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
}