import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already in use." });
      return;
    }

    // 2. Hash the password with bcryptjs (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role ?? "student",
    });

    // 4. Sign a JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 5. Remove password from response
    const userObj = user.toJSON();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly select password (it's hidden by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // 2. Compare provided password with hashed password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // 3. Sign a JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 4. Remove password from response object
    const userObj = user.toJSON();

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}
