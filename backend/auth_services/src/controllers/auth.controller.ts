
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Prisma } from "@prisma/client"

import prisma from "../services/prisma";


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const validRoles = ["CLIENT", "ADMIN"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    })

    if (role == "CLIENT") {
      await prisma.clientProfile.create({
        data: { userId: newUser.id }
      })
    }

    if (role == "ADMIN") {
      await prisma.adminProfile.create({
        data: { userId: newUser.id }
      })
    }

    res.status(201).json({
      message: "User created!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

  } catch (err) {
    console.error("Error registering user:", err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(409).json({ message: "Email already registered" });
        return;
      }
    }

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

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    res.status(200).json({
      message: "User logged in successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Error logging in user:", err);

    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
