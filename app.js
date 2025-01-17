import express from 'express';
import { API_VERSION } from './constants.js';
import cors from 'cors';

const app=express();

const corsOptions = {
    origin: '*',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Router imports
import authRouter from './src/router/auth.router.js';
import moneyRouter from './src/router/money.router.js';
import transactionHistoryRouter from './src/router/transactionHistory.router.js';
import balanceRouter from './src/router/balance.router.js';
import profileRouter from './src/router/profile.router.js';

//Router declaration
app.use(`${API_VERSION}/auth`,authRouter);
app.use(`${API_VERSION}/transaction`,moneyRouter);
app.use(`${API_VERSION}/transactionHistory`,transactionHistoryRouter);
app.use(`${API_VERSION}/balance`,balanceRouter);
app.use(`${API_VERSION}/profile`,profileRouter);

export default app;