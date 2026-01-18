import express from "express";
import { pool } from "./database";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
