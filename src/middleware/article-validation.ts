import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().optional(),
  category: z.string().min(2, "Category is required"),
});

export function validateCreateArticle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createArticleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map(issue => issue.message),
    });
  }

  next();
}
