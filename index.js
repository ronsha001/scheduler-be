import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import storeRoutes from "./routes/store.js";
import eventRoutes from "./routes/event.js";

const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/event", eventRoutes);
app.get("/api/health", (req, res, next) => {
  res.status(200).send("OK")
})
app.get("/api/say-hello", (req, res, next) => {
  res.status(200).send("Hello World")
})
app.get("/api/rotem", (req, res, next) => {
  res.status(200).send("Hello Rotem !!!")
})


//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(5000, () => {
  connect();
  console.log("Connected to Server");
});