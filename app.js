import express from 'express';
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'

const app = express();

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/users', userRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {
    res.send("It works!");
});

export default app;