import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken"

export const registerCtrl = async(req,res)=>{
    try {
        if(!req.files || Object.keys(req.files).length ===0){
            return res.status(400).json({message: "Please provide photo"})
        }
        const {photo}= req.files
        const {name, email, password,education,phone}= req.body
        if(!name || !email || !password || !education || !phone) return res.status(400).json({message: "Please provide all details."})
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message: "User already exist with this email address."})
        
        //uploading file on cloudinary
        const allowedFormat = ["image/jpeg","image/png"]
        if(!allowedFormat.includes(photo.mimetype)) return res.status(400).json({message: "Please provide valid format of photo."})
        const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath)
        if(!cloudinaryResponse || cloudinaryResponse.error){
            console.log(cloudinaryResponse.error)
        }

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password,salt)
        const newUser = new User({name, email,password:hashPassword,education, phone,photo: cloudinaryResponse.url})
        await newUser.save()
        res.status(201).json({message: "User registration successful."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const loginCtrl =async(req,res)=>{
    try {
        const {role, email,password}= req.body
        if(!role || !email || !password) return res.status(400).json({message: "Please provide all details."})
        const user = await User.findOne({email,role}).select("+password")
        if(!user) return res.status(400).json({message: `User not found with this ${role} role and email address.`})
        const comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) return res.status(400).json({message: "Password not matched."})
        const userId = user._id
        const token =await jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: '7d'})
        res.cookie("jwt",token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
        await User.findByIdAndUpdate(userId, {token})
        res.status(200).json({message: "Login sucessfull.",token})
    }catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error while login"})
    }
}

export const logoutCtrl = async(req,res)=>{
    try {
        res.clearCookie("jwt")
        res.status(200).json({message: "Logout Successful."})
    }catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error while logout"})
    }
}