import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
     email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
    },
    passwordHash:{
        type: String,
        required: true
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    bloodType:{
        type: String,
        enum:  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
        default: null
    },
    location:{
        type: String,
        enum:["Point"],
        required: true,
        default: "Point"
    },
    coordinates:{
        type:[Number],
        required: true,
        index: '2dsphere'
    },
    notificationPreference:{
        urgentAlert: { type: Boolean, default: true },
        reminder: { type: Boolean, default: true }    },
    //para el estado de actividad
    status:{
        type: String,
        enum:["Donando", "Descansando"],
        default: 'Descansando'
    },
    inactivetyReason:{
        type: String,
        default: null
    }
},{
    timestamps: true
});   

//para ocultar la password en las respuestas
userShcema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.passwordHash;
    return user;
};

//hasheamos la pass
userShcema.pre("save", async function(next) {
    if(!this.isModified("passwordHash"))return next();

    try{
        const salt = await bcrypt.genSalt(7);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    }catch(error){
        next(error);
    }
});

//verificacion de pass
userShcema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

 export const User = mongoose.model("User", userShcema);