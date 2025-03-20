import mongoose from "mongoose";
import {Blog} from "../models/blog.model.js"
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async(req,res)=>{
    try {
        if(!req.files || Object.keys(req.files).length ===0){
                    return res.status(400).json({message: "Please provide Blog image."})
                }
                const {blogImage}= req.files
                const {title, about, category}= req.body
                if(!title || !about || !category) return res.status(400).json({message: "Please provide all details."})
                const adminImage = req.user.photo;
                const adminName = req.user.name;
                const createdBy = req.user._id
                
                //uploading file on cloudinary
                const allowedFormat = ["image/jpeg","image/png"]
                if(!allowedFormat.includes(blogImage.mimetype)) return res.status(400).json({message: "Please provide valid format of photo."})
                const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath)
                if(!cloudinaryResponse || cloudinaryResponse.error){
                    console.log(cloudinaryResponse.error)
                }

                const blogData = {title, about,category, blogImage: cloudinaryResponse.url, adminImage,adminName, createdBy}
                await Blog.create(blogData)
                res.status(201).json({message: "Blog created successfully."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error while creation Blog."})
    }
}

export const deleteBlog =async(req,res)=>{
    try {
        const {id}= req.params
        const blog = await Blog.findByIdAndDelete(id)
        res.status(200).json({message: "Blog deleted successfully."})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error."})
    }
}

export const getAllBlog = async(req,res)=>{
    try {
        const blogs = await Blog.find()
        res.status(200).json({blogs})
    }  catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error."})
    }
}

export const getSingleBlog =async(req,res)=>{
    try {
        const {id}= req.params
        console.log(id)
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Given Blog Id is not valid."})
        }
        const blog=await Blog.findById(id)
        if(!blog) return res.status(404).json({message: "Blog not found."})
        res.status(200).json({blog})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error."})
    }
}

export const getMyBlog = async(req,res)=>{
    try {
        const createdBy = req.user._id
        const myBlogs = await Blog.find({createdBy})
        if(myBlogs.length == 0) return res.status(200).json({message: "You don't created any Blog yet."})
        res.status(200).json({myBlogs})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error."})
    }
}

export const updateBlog = async(req,res)=>{
    try {
        const {id} = req.params
        const updatedBlog = await Blog.findByIdAndUpdate(id,req.body, {new: true})
        if(!updatedBlog) return res.status(400).json({message: "Blog not found."})
        res.status(200).json({message: "Blog updated successfully.", updatedBlog})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error."})
    }
}