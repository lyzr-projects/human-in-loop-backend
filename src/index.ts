import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { expressjwt } from "express-jwt";

import { prisma } from "./library/prisma";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET!;

// Unauthenticated Routes
app.get("/ping", (_req, res) => {
  res.send("pong");
});

// Authenticated Routes (JWT-based)
app.use(
  "/api",
  expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req: any) => {
      const token = req.cookies?.accessToken;
      return token;
    },
  })
);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Prisma cleanup on server shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
