import { body } from "express-validator";

export const registerValidation = [
    body("email")
    .isEmail()
    .withMessage("Debe ingresar un mail valido")
    .normalizeEmail(),

    body("password")
    .isLength({min: 8})
    .withMessage("La contraseña debe tener 8 caracteres o mas")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe tener al menos una mayuscula, una minuscula y un numero"),

    body("coordinates")
    .isArray()
    .withMessage("Las coordenadas deben ser un array")
    .custom((coords)=>{
        if(coords.length !==2){
            throw new Error("El array de coordenadas debe tener 2 valores: [longitud, latitud]");
        }
        const [longitude, latitude] = coords;

        //validacion para saber si son numeros
        if(typeof longitude !== 'number' || typeof latitude !== 'number') {
            throw new Error("Las coordenadas deben ser numeros validos");
        }

        //validar rangos de longitud y latitud
        if(longitude < -180 || longitude > 100){
            throw new Error("La longitud debe estar entre -180 y 180");
        }
        if(latitude < -90 || latitude > 90 ){
            throw new Error("La latitud debe estar entre -90 y 90");
        }
        return true;
    })
    .optional(),

    //validaciones para las instituciones
    body("role")
    .optional()
    .isIn(['donor', 'institution'])
    .withMessage("El rol debe ser valido"),

    body("institutionName")
    .if(body('role').equals('institution'))
    .notEmpty()
    .withMessage("El nombre de la institucion es requerido para roles de institucion")
    .isLength({min: 3, max: 100})
    .withMessage("El nombre de la institucion debe tener entre 3 y 100 caracteres"),

    body("cuit")
    .if(body('role').equals('institution'))
    .notEmpty()
    .withMessage("EL CUIT es requerido para instituciones")
    .matches(/^\d{11}$/)
    .withMessage("El CUIT debe tener 11 digitos numericos")
];

//validaciones para el login

export const loginValidation = [
    body("email")
    .isEmail()
    .withMessage("Debe ingresar un mail valido")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
];
export const updateUserValidation = [
    body("email")
    .optional()
    .isEmail()
    .withMessage("Debe ingresar un mail valido")
    .normalizeEmail(),

    body("bloodType")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null])
    .withMessage("Tipo de sangre no valido"),

    body("coordinates")
    .optional()
    .isArray()
    .withMessage("Las coordenadas deben ser un array")
    .custom((coords)=>{
        if(coords && coords.length !== 2){
            throw new Error("El array de coordenadas debe contener dos valores");
        }
        return true;
    }),

    body("status")
    .optional()
    .isIn(["Donando", "Descansando"])
    .withMessage("El estado debe ser uno valido")
];