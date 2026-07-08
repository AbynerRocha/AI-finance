import { Router, type Request } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, type LoginSchemaType } from "../schemas/auth.schemas.js";
import { loginRoute } from "./auth/login.js";

const router = Router()

export type LoginRequest = Request<any, any, LoginSchemaType['body']>

router.post('/', validate(loginSchema), (req: LoginRequest, res, next) => loginRoute(req,res,next))

export default router
