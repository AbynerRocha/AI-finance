import { generateDocs } from './docs/docs.js';
import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errors.middleware.js'
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express'
import { apiReference } from '@scalar/express-api-reference';

export const app = express()
const port = env.PORT

console.log()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: env.FRONT_END_URL,
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    credentials: true
}))

const opeanApiDocument = generateDocs()

app.use(routes)
app.use(errorHandler)
app.use('/docs', apiReference({
    content: opeanApiDocument,
    theme: "deepSpace"
}))

app.listen(port, () => {
    console.log("💻 Servidor online: http://localhost:3000")
    console.log("📕 Documentação em: http://localhost:3000/docs")
})