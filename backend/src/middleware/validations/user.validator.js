import {body} from "express-validator";
import { register } from "../../controllers/auth.controller";

export const registerValidation = [
    body("email")
    .isEmail().withMessage("Email invalido"),
    body("password")
    .isLength({min: 8}).withMessage("La contraseña debe tener 8 caracteres o mas"),
    body("coordinates")
    .isArray().withMessage("Las coordenadas deben ser un Array")
    .custom((coords)=>{
        if(coords.length !==2){
            throw new Error("Las coordenadas deben tener la longitud y la latitud");
        }
        return true;
    })
]