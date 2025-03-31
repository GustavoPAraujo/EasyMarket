
import { Request, response, Response } from "express"
import bcrypt from "bcrypt"

import prisma from "../services/prisma";


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    res.status(201).json({
      message: "User created!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    })

  } catch (err) {
    console.error("Error registering user:", err)

    if (!res.headersSent) res.status(500).json({ message: "Internal server error" });
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    res.status(200).json({
      message: "User logged in successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Error logging in user:", err);

    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
