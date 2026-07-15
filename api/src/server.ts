import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errors.middleware.js'
import cookieParser from 'cookie-parser';

const app = express()
const port = env.PORT

console.log()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: env.FRONT_END_URL,
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    credentials: true
}))

app.use(routes)
app.use(errorHandler)

app.listen(port, () => console.log("Servidor online"))