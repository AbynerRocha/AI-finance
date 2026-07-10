import { Router } from "express";
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import { generateAuthToken, getDataFromAuthToken } from "../controllers/auth/token/index.js";

const router = Router()

router.get('/', async (req, res) => {
    const token = await generateAuthToken("7bd9410f-41db-4780-b4a7-3aa2a286bd08", 'user')

    return res.status(200).json({
        token, 
    })
})

router.use('/user', userRoutes)
router.use('/auth', authRoutes)

export default router

