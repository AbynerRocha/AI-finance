import { Router } from "express";
import userRoutes from './user.routes.js'

const router = Router()

router.get('/', (req, res) => res.send("OK"))

router.use('/user', userRoutes)

export default router

