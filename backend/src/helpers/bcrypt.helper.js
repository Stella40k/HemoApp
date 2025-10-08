import bcrypt from "bcrypt";

export const hashedPassword = (password)=>{
    try {
        return bcrypt.hash(password, 5);
    } catch (error) {
        console.log("Error al hashear la contraseña", error);
        throw new Error("Error interno con la contraseña: hasheo error")
    };
};
export const comparePasswords = (password, hashedPassword) =>{
    try {
        return bcrypt.compare(password, hashedPassword)
    } catch (error) {
        console.log("Error al comparar contraseñas", error);
        throw new Error("Error al autenticar la contraseña")
    };
};