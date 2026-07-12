import { Router, type Request } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { createWalletSchema, getAllWalletsSchema, type CreateWalletSchema } from "../schemas/wallet.schemas.js";
import { createWalletRoute } from "./user/wallets/create.js";
import { getAllWalletsRoute } from "./user/wallets/get-all.js";

const router = Router()

export type CreateWalletRequest = Request<any, any, CreateWalletSchema['body']>

router.post('/', validate(createWalletSchema), (req: CreateWalletRequest, res, next) => createWalletRoute)

export type getAllWalletsRequest = Request<any, any, null>

router.get('/', validate(createWalletSchema), (req: getAllWalletsRequest, res, next) => getAllWalletsRoute)

export default router
