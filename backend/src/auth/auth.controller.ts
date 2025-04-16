import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/react-native.js"


import prisma from "../services/prisma/prisma";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    email = email.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number"
      });
      return;
    }

    const validRoles = ["CLIENT", "ADMIN"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdUser = await tx.user.create({
        data: { name, email, password: hashedPassword, role }
      });

      if (role === "CLIENT") {
        await tx.clientProfile.create({ data: { userId: createdUser.id } });
      }

      if (role === "ADMIN") {
        await tx.adminProfile.create({ data: { userId: createdUser.id } });
      }

      return createdUser;
    });

    res.status(201).json({
      message: "User created!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("Error registering user:", err);

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(409).json({ message: "Email already registered" });
        return;
      }
    }

    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};


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

    let tokenPayload: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    if (user.role === "ADMIN") {
      const adminProfile = await prisma.adminProfile.findUnique({
        where: { userId: user.id }
      });

      if (adminProfile) {
        tokenPayload.adminProfileId = adminProfile.id;
      }
    }

    if (user.role === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: user.id }
      });

      if (clientProfile) {
        tokenPayload.clientProfileId = clientProfile.id;
      }
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );


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
