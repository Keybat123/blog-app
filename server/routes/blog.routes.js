import express from "express"
import { createBlog, deleteBlog, getAllBlog, getMyBlog, getSingleBlog, updateBlog } from "../controllers/blog.controller.js"
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/create-blog",isAuthenticated,isAdmin("admin"), createBlog)
router.delete("/delete-blog/:id",isAuthenticated,isAdmin("admin"),deleteBlog)
router.get("/get-single-blog/:id",isAuthenticated,getSingleBlog)
router.get("/get-all-blogs",isAuthenticated,getAllBlog)
router.get("/get-my-blogs",isAuthenticated,isAdmin("admin"),getMyBlog)
router.put("/update-blog/:id",isAuthenticated,isAdmin("admin"),updateBlog)

export default router