import { Request, Response } from "express";
import prisma from "../services/prisma";

export const createStore = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  let { name, description } = req.body

  if (!name) {
    res.status(401).json({ message: 'Missing required fields' })
    return
  }

  try {
    const store = await prisma.store.create({
      data: { name, description, adminId }
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
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: adminId },
      include: { store: true }
    });

    if (!adminProfile) {
      console.log(adminProfile)
      res.status(404).json({ message: "Admin profile not found" })
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

export const updateStore = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  const adminProfile = await prisma.adminProfile.findUnique({
    where: { id: adminId },
    include: { store: true }
  });
  if (!adminProfile?.store) {
    res.status(401).json({ message: 'Store not found' })
  }

  let { name, description } = req.body
  const updatedStore: any = {}

  if (name != null && name != adminProfile?.store?.name) {
    updatedStore.name = name
  }

  if (description != null && description != adminProfile?.store?.description) {
    updatedStore.description = description
  }

  if (Object.keys(updatedStore).length === 0) {
    res.status(400).json({ message: "No valid fields provided to update" });
    return;
  }

  try {
    const storeId = adminProfile?.store?.id
    const store = await prisma.store.update({
      where: { id: storeId },
      data: updatedStore
    });

    res.status(200).json({
      message: "Store updated successfully",
      store: {
        id: storeId,
        name: updatedStore.name,
        description: updatedStore.description
      }
    });

  } catch (err) {
    console.log("update store error: ", err)
    res.status(500).json({ message: "Internal server error" })
  }

}

export const getStoreProducts = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId

  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  const adminProfile = await prisma.adminProfile.findUnique({
    where: { id: adminId },
    include: { store: true }
  });

  if (!adminProfile) {
    console.log(adminProfile)
    res.status(404).json({ message: "Admin profile not found" })
    return
  }
  if (!adminProfile.store) {
    res.status(404).json({ message: "No store associated with this admin" });
    return;
  }

  const storeId = adminProfile.store.id

  try {
    const products = await prisma.product.findMany({
      where: {storeId}
    })
    res.status(200).json({
      message: `Store ${storeId} products fetched successfully`,
      products: products
    })

  } catch (err) {
    console.error("Error fetching store products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}