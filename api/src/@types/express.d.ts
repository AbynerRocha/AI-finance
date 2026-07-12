import type { User } from "../generated/prisma/client.ts";
import type { AccessLevel } from "./access-level.js";


declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string,
                accessLevel: AccessLevel
            }
        }
    }
}