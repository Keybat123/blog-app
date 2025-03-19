import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const isAuthenticated = async(req,res,next)=>{
    try {
        const token = await req.cookies.jwt;
        if(!token) return res.status(404).json({message: "Token missing."})
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) return res.status(400).json({message: "Token not matched."})
        const user = await User.findById(decoded.userId)
        if(!user) return res.status(404).json({message: "User not found."})
        res.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error while authenticating user."})
    }
}