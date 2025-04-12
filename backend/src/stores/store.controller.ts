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

export const getAllStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const stores = await prisma.store.findMany();
    res.status(200).json({
      message: "All stores retrieved successfully",
      stores,
    });
  } catch (err) {
    console.error("Error fetching all stores:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchStoresByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ message: "Name query parameter is required" });
    return;
  }
  
  try {
    const stores = await prisma.store.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    if(!stores.length){
      res.status(400).json({message: `No stores found for the search: '${name}'`})
      return;
    }
    res.status(200).json({
      message: "Stores retrieved successfully",
      stores,
    });
  } catch (err) {
    console.error("Error searching stores by name:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStoreById = async (req: Request, res: Response): Promise<void> => {
  const storeId = parseInt(req.params.storeId, 10);
  if (isNaN(storeId)) {
    res.status(400).json({ message: "Invalid store ID" });
    return;
  }
  
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { products: true }
    });
    if (!store) {
      res.status(404).json({ message: "Store not found" });
      return;
    }
    res.status(200).json({
      message: "Store retrieved successfully",
      store,
    });
  } catch (err) {
    console.error("Error fetching store by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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