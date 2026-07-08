import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errors.middleware.js'

const app = express()
const port = env.PORT

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ['POST', 'GET', 'DELETE', 'PUT']
}))

app.use(routes)
app.use(errorHandler)

app.listen(port, () => console.log("Servidor online"))