import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
        minlength:[200, "Please provide at least 200 words."]
    },
    blogImage: {
        type: String,
        required: true,
    },
    adminImage: {
        type: String,
    },
    adminName: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }

},{timestamps: true})

export const Blog = mongoose.model("Blog", blogSchema)