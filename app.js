import express from 'express';
import userRouter from './routes/user.router.js'
import productRouter from './routes/product.router.js'

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