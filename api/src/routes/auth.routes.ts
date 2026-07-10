import { Router, type Request } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema, type LoginSchemaType, type RegisterSchemaType } from "../schemas/auth.schemas.js";
import { loginRoute } from "./auth/login.js";
import { registerUserRoute } from "./auth/register.js";

const router = Router()

export type LoginRequest = Request<any, any, LoginSchemaType['body']>
export type RegisterUserRequest = Request<any, any, RegisterSchemaType['body']>

router.post('/login', validate(loginSchema), (req: LoginRequest, res, next) => loginRoute(req,res,next))
router.post('/register', validate(registerSchema), (req: RegisterUserRequest, res, next) => registerUserRoute(req,res,next))

export default router
