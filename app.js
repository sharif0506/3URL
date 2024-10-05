import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './user/routes.js';
import urlRouter from "./url/Route/UrlRoutes.js";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


// MongoDB Connection
try {
    await mongoose.connect('mongodb://127.0.0.1/3url');
} catch (exception) {
    console.log(exception)
}

app.use('/api/users', userRouter);
app.use('/api/urls', urlRouter);

export default app;