import { Request, Response } from "express";
import prisma from "../services/prisma";

export const createStore = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId

  let { name, description } = req.body

  if (!name) {
    res.status(401).json({message: 'Missing required fields'})
    return
  }

  if (!adminId) {
    res.status(401).json({message: 'User not logged'})
    return
  }

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

export const getStore = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId

  if (!adminId) {
    res.status(401).json({message: 'User not authenticated'}) 
    return
  }

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: adminId },
      include: { store: true }
    });

    if (!adminProfile) {
      console.log(adminProfile)
      res.status(404).json({message: "Admin profile not found"})
      return
    }
    if (!adminProfile.store) {
      res.status(404).json({ message: "No store associated with this admin" });
      return;
    }

    res.status(200).json({
      message: "Store info",
      store: adminProfile.store
    })

  } catch (err) {
    console.error("Error fetching store:", err);
    res.status(500).json({ message: "Internal server error" });
  }
 }
