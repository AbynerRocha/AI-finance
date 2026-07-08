import express from 'express';
import cors from 'cors';
import { env } from './env.js';
const app = express();
const port = env.PORT;
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['POST', 'GET', 'DELETE', 'PUT']
}));
app.listen(port, () => console.log("Servidor online"));
//# sourceMappingURL=server.js.map