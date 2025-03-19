import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectDB from "./config/index.js"

const app = express()
connectDB()
app.use(express.json())

//routes
app.get('/',(req,res)=>{
    res.send("Hello from main route")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})

