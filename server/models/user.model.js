import mongoose from "mongoose";
import validator from "validator"

const userScheme = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: [validator.isEmail, "Please provide valid email address"]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    education: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default: "user"
    },
    token: {
        type: String,
    }
},{timestamps: true})

export const User = mongoose.model("User", userScheme)