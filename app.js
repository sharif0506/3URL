import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './user/Route/UserRoutes.js';
import urlRouter from "./url/Route/UrlRoutes.js";
import shortUrlRouter from "./url/Route/ShortUrlRoutes.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


// MongoDB Connection
try {
    const mongoDbUrl = process.env.MONGODB_URL;
    console.log(mongoDbUrl, typeof mongoDbUrl);
    await mongoose.connect(mongoDbUrl);
} catch (exception) {
    console.log(exception)
}

app.use('/api/users', userRouter);
app.use('/api/urls', urlRouter);

app.use('/t', shortUrlRouter);

export default app;