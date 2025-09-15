import mongoose from "mongoose";

export const userShcema = new mongoose.Schema({
     email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
    },
    passwordHash:{
        type: String,
        require: true
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
        require: true,
        default: "Point"
    },
    coordinates:{
        type:[Number],
        require: true,
        index: '2dsphere'
    },
    notificationPreference:{
        type: Map,
        of: Boolean,
        default: {urgentAlert: true, reminder: true}
    },
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
userShcema.method.toJSON = function(){
    const user=this.toObject();
    delete user.passwordHash;
    return user;
};
 export const User = mongoose.model("User", userShcema);