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

    if (!adminProfile || !adminProfile.store) {
      res.status(400).json({ message: "No store associated with this admin" })
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

export const updateProduct = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' })
    return
  }

  const productId = req.params.productId
  if (!productId) res.status(401).json({ message: "Product not found" })

  const productFromDB = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) }
  });
  if (!productFromDB) {
    res.status(404).json({ message: "Product not found in database" });
    return;
  }
  const storeId = productFromDB.storeId;
  if (!storeId) {
    res.status(400).json({ message: "No store associated with this product" });
    return;
  }

  let { name, description, price, quantity } = req.body
  const updatedProduct: any = {}

  if (name != null) {
    if (name !== productFromDB.name) {
      const duplicate = await prisma.product.findFirst({
        where: {
          storeId: storeId,
          name: name,
          NOT: { id: parseInt(productId, 10) }
        }
      });
      if (duplicate) {
        res.status(400).json({ message: "A product with this name already exists in this store" });
        return;
      }
      updatedProduct.name = name;
    }
  }

  if (description != null && description !== productFromDB.description) {
    updatedProduct.description = description;
  }
  if (price != null && Number(price) !== Number(productFromDB.price)) {
    updatedProduct.price = Number(price);
  }
  if (quantity != null && Number(quantity) !== productFromDB.quantity) {
    updatedProduct.quantity = Number(quantity);
  }

  if (Object.keys(updateProduct).length === 0){
    res.status(400).json({ message: "No valid changes provided" });
    return;
  }

  try {

    const updatedProductData = await prisma.product.update({
      where: { id: parseInt(productId, 10)},
      data: updatedProduct
    })

    res.status(200).json({
      message: "Product updated successfully",
      updatedInfo: updatedProductData 
    })

  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }


}
