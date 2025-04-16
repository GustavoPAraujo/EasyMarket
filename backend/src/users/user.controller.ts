
import { Request, Response } from "express"

import prisma from "../services/prisma/prisma";

export const getMe = (req: Request, res: Response): void => {

  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  res.status(200).json({
    message: "Authenticated user",
    user
  });
};

export const updateUserData = async (req: Request, res: Response): Promise<void> => {

  const userId = req.user?.id
  if(!userId){
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  let { name, email } = req.body

  const updatedUser: any = {}

  if (name) updatedUser.name = name;

  if (email) {
    email = email.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const usedEmail = await prisma.user.findFirst({
      where: { email }
    });
    if (usedEmail) {
      res.status(400).json({ message: "This email is already in use" })
      return
    }
    updatedUser.email = email
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedUser
    });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({message: "Internal server error"})
  }
}
