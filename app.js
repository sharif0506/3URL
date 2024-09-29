import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './user/routes.js';
import urlRouter from "./url/Route/UrlRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


app.use('/api/users', userRouter);
app.use('/api/urls', urlRouter);

export default app;