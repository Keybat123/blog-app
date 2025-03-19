import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectDB from "./config/index.js"
import userRoutes from "./routes/user.routes.js"
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"

const app = express()
connectDB()
app.use(express.json())

//middlewares
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(cookieParser())

//cloudinary setup
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

//routes
app.use("/api/v1/users",userRoutes)
app.get('/',(req,res)=>{
    res.send("Hello from main route")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})

