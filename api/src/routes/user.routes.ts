import { Router, type Request } from "express";
import { getUserRoute } from "./user/get-user.js";
import { createUserRoute } from "./user/create-user.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, getUserSchema, type CreateUserSchemaType, type GetUserSchemaType } from "../schemas/user.schemas.js";

const router = Router()

export type GetUserRequest = Request<GetUserSchemaType['params']>

router.get('/:id', validate(getUserSchema), (req: GetUserRequest, res, next) => getUserRoute(req,res, next))

export type CreateUserRequest = Request<any, any, CreateUserSchemaType['body']>

router.post("/create", validate(createUserSchema), (req: CreateUserRequest, res, next) => createUserRoute(req, res, next))

export default router