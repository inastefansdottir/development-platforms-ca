import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import { generateToken } from "../utils/jwt";
import { User, UserResponse } from "../interfaces";
import {
  validateLogin,
  validateRegistration,
} from "../middleware/auth-validation";

const router = Router();

router.post("/register", validateRegistration, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const existingUsers = rows as User[];

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user in database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hashedPassword],
    );

    const userResponse: UserResponse = {
      id: result.insertId,
      email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [rows] = await pool.execute(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email],
    );
    // Convert database rows to typed User array
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Since email is unique, take the first (and only) user
    const user = users[0];

    // Compare provided password with stored hash
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user info and token
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
});

export default router;
