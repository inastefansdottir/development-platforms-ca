import { Router } from "express";
import { pool } from "../database";
import { ResultSetHeader } from "mysql2";
import { Article, ArticlesWithAuthor } from "../interfaces";
import { validateCreateArticle } from "../middleware/article-validation";
import { authenticationToken } from "../middleware/auth-validation";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT a.id, a.title, a.body, a.category, a.created_at, 
        a.submitted_by, u.email AS author_email
      From articles a
      JOIN users u ON a.submitted_by = u.id
      ORDER BY a.created_at DESC
    `);

    const articles = rows as ArticlesWithAuthor[];
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.post(
  "/",
  authenticationToken,
  validateCreateArticle,
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const { title, body, category } = req.body;

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO articles (title, body, category, submitted_by)
       VALUES (?, ?, ?, ?)`,
        [title, body, category, userId],
      );

      const articleId = result.insertId;

      // Fetch the inserted article with author email
      const [rows] = await pool.execute(
        `
      SELECT a.id, a.title, a.body, a.category, a.created_at, 
        a.submitted_by, u.email AS author_email
      From articles a
      JOIN users u ON a.submitted_by = u.id WHERE a.id = ?
      ORDER BY a.created_at DESC`,
        [articleId],
      );

      const article = (rows as ArticlesWithAuthor[])[0];

      res.status(201).json({ message: "Article created", article });
    } catch (error) {
      console.error("Error creating an article", error);
      res.status(500).json({ error: "Failed to create an article" });
    }
  },
);

export default router;
