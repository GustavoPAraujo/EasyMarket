import { Request, Response } from "express";
import prisma from "../services/prisma";


export const createStore = async (req: Request, res: Response) => {

  const adminId = req.user?.id

  let { name, description } = req.body

  if (!name) {
    res.status(401).json({message: 'Missing required fields'})
    return
  }

  if (!adminId) {
    res.status(401).json({message: 'User not logged'})
    return
  }
  console.log("store info:", name, description, adminId)

  try {
    const store = await prisma.store.create({
      data: { name, description, adminId}
    });

    res.status(201).json({
      message: 'Store created successfully!',
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        adminId: store.adminId
      }
     })

    } catch (err) {
      console.error("Error creating store:", err);
      res.status(500).json({ message: "Internal server error" });
    }
}
