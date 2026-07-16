import { Router, type Request } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { createWalletSchema, getAllWalletsSchema, getWalletSchema, type CreateWalletSchema, type GetWalletSchema } from "../schemas/wallet.schemas.js";
import { createWalletRoute } from "./user/wallets/create.js";
import { getAllWalletsRoute } from "./user/wallets/get-all.js";
import { getWalletRoute } from "./user/wallets/get.js";

const router = Router()

export type CreateWalletRequest = Request<any, any, CreateWalletSchema['body']>

router.post('/', validate(createWalletSchema), createWalletRoute)

export type getAllWalletsRequest = Request<any, any, null>

router.get('/', validate(getAllWalletsSchema), getAllWalletsRoute)

export type GetWalletRequest = Request<GetWalletSchema['params']>

router.get('/:walletId', validate(getWalletSchema), getWalletRoute)

export default router
