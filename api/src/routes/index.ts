import { Router } from "express";
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import walletRoutes from './wallet.routes.js'
import { generateAccessToken, getDataFromToken } from "../controllers/auth/token/index.js";
import { registry } from "../docs/docs.js";
import { validationErrorSchema } from "../schemas/errors.schemas.js";

const router = Router()



router.get('/', async (req, res) => {
   return res.status(200).send()
})

router.use('/user', userRoutes)
router.use('/auth', authRoutes)
router.use('/wallet', walletRoutes)

export default router

