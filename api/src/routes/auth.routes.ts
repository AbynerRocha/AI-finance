import { Router, type Request } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema, type LoginSchemaType, type LogoutSchemaType, type RegisterSchemaType } from "../schemas/auth.schemas.js";
import { loginRoute } from "./auth/login.js";
import { registerUserRoute } from "./auth/register.js";
import { refreshTokenRoute } from "./auth/refresh.js";
import { logoutRoute } from "./auth/logout.js";

const router = Router()

export type LoginRequest = Request<any, any, LoginSchemaType['body']>
export type RegisterUserRequest = Request<any, any, RegisterSchemaType['body']>

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autentica um utilizador
 *     description: Valida as credenciais, devolve um token de acesso e define o cookie HTTP-only de refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: utilizador@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha-segura
 *     responses:
 *       200:
 *         description: Autenticação efetuada com sucesso.
 *         headers:
 *           Set-Cookie:
 *             description: Cookie `finance_refresh_token` HTTP-only, usado para renovar a sessão.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - user
 *                 - accessToken
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Dados do utilizador autenticado.
 *                   additionalProperties: true
 *                 accessToken:
 *                   type: string
 *                   description: JWT para enviar no cabeçalho `Authorization` como Bearer token.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Corpo da requisição inválido.
 *       401:
 *         description: Email ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: Utilizador ou senha inválida.
 */
router.post('/login', validate(loginSchema), (req: LoginRequest, res, next) => loginRoute(req,res,next))
router.post('/logout', validate(logoutSchema), (req, res, next) => logoutRoute(req,res,next))
router.post('/refresh', validate(refreshSchema), (req, res, next) => refreshTokenRoute(req,res,next))
router.post('/register', validate(registerSchema), (req: RegisterUserRequest, res, next) => registerUserRoute(req,res,next))

export default router
