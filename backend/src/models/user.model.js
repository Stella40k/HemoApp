import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName:{
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
        minlength: 6,
        select: false
    },
    role:{
        type: String,
        enum :["donador", "isntitucion", "moderador", "community_member"], //"community_member" usuarios no donantes
        default: "community_member",
        index: true
    },
    status:{
        type: String,
        enum:["active", "inactive"],
        default: "inactive"
    },
    profile:{
        firtsName:{
            type: String,
            minlength: 3,
            maxlength: 50,
            trim: true,
            required: true
        },
        lastName:{
            type: String,
            minlength: 3,
            maxlength: 60,
            trim: true,
            required: true
        },
        dni:{
            type: String,
            unique: true,
            match: [/^\d{7,8}$/],
        },
        birthDate:{
            type: Date,
            required: true
        },
        gender:{
            type: String,
            enum: ["male", "female", "other"]
        },
        bloodType:{
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
            default: null
        },
        factor:{
            type: String,
            enum: ["positive", "negative", null],
            default: null
        }
    },

    //faltan las cosas para la ubicacion creo
},{
    versionKey: false,
    timestamps: true
});

export const userModel = mongoose.model("User", userSchema);