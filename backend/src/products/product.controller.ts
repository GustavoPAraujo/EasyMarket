import { Request, Response } from "express";
import prisma from "../services/prisma";

export const createProduct = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  let { name, description, price, quantity } = req.body

  if (!name || !description || !price || !quantity) {
    res.status(401).json({ message: 'Missing required fields' })
    return
  }

  if (isNaN(Number(price))) {
    res.status(400).json({ message: "Price must be a number" });
    return;
  }
  if (isNaN(Number(quantity))) {
    res.status(400).json({ message: "Quantity must be a number" });
    return;
  }

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: adminId },
      include: { store: true }
    })

    if (!adminProfile || !adminProfile.store ) {
      res.status(400).json({message: "No store associated with this admin"})
      return
    }

    const storeId = adminProfile.store.id;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        storeId 
      }
    })

    res.status(200).json({
      message: "Product created successfully!",
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        storeId: product.storeId  
      }
    })
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

