import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './routes/user';
import articleRouter from './routes/article';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(morgan("tiny"));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// routing
app.use("/api/v1/users", userRouter)
app.use("/api/v1/articles", articleRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default app;
