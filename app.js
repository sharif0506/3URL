import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './user/routes.js';
import urlRouter from "./url/Route/UrlRoutes.js";
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

app.get('/:shortCode', (req, res) => {
    // redirect to original url
    res.redirect("http://www.youtube.com");
});

export default app;