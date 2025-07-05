import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
import messageRouter from './routes/message.route.js';
import { app, server } from './socket/socket.js';

dotenv.config();
const port = process.env.PORT || 8000;

// ✅ Setup middlewares
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Setup routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);

// ✅ Proper server start after DB connect
const startServer = async () => {
  try {
    await connectDb(); // 💥 Wait for DB to connect first
    server.listen(port, () => {
      console.log(`✅ Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect DB:", err.message);
  }
};

startServer(); // 👈 call the function
