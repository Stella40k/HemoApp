import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const profileSchema = new Schema({
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
    birthDate:{
        type: Date,
    },

})

const userSchema = new Schema({
    userName:{

    },
    email: {

    },
    passwors:{

    },
    role:{

    },
    profile: profileSchema
},{
    versionKey: false,
    timestamps: true
});

export const userModel = mongoose.model("user", userSchema);