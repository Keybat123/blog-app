import express from "express"
import { loginCtrl, logoutCtrl, registerCtrl } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register",registerCtrl)
router.post("/login",loginCtrl)
router.get("/logout",isAuthenticated,logoutCtrl)

export default router