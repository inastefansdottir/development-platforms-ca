import express from "express";
import { pool } from "./database";
import "dotenv/config";
import authRoutes from "./routes/auth";
import articlesRoutes from "./routes/articles";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/articles", articlesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
