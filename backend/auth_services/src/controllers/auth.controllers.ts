
  import { Request, Response } from "express"
  import prisma from "../services/prisma";

  export const register = async (req: Request, res: Response): Promise<void> => {

    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const newUser = await prisma.user.create({
        data: { name, email, password }
      })
  
      res.status(201).json({
        message: "User created!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      })

      res.status(200).json({user: {name, email}, message: "User info"})

    } catch (err) {
      console.error("Error registering user:", err)
      res.status(500).json({ message: "Internal server error" });
    }
  }
  