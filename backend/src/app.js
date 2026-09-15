import express from "express";
import cors from "cors";
import githubRoutes from "./routes/github.routes.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/github", githubRoutes);
app.use("/api/auth", authRoutes);

export default app;
