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

export const getProductById = async (req: Request, res: Response): Promise<void> => {

  const productId = req.params.productId;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  const parsedProductId = parseInt(productId, 10);
  if (isNaN(parsedProductId)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  const productFromDB = await prisma.product.findUnique({
    where: { id: parsedProductId }
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

  try {
    res.status(200).json({
      message: `Product with ID ${parsedProductId} info`,
      product: productFromDB
    })
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const getProductsByQuery = async (req: Request, res: Response): Promise<void> => {

  try {
    const { name, minPrice, maxPrice } = req.query;

    const filters: any = {};

    if (name && typeof name === 'string') {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      filters.price = {};

      if (minPrice && !isNaN(Number(minPrice))) {
        filters.price.gte = Number(minPrice);
      } else if (minPrice) {
        res.status(400).json({ message: "'minPrice' must be a valid number" });
        return;
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        filters.price.lte = Number(maxPrice);
      } else if (maxPrice) {
        res.status(400).json({ message: "'maxPrice' must be a valid number" });
        return;
      }
    }

    const products = await prisma.product.findMany({
      where: filters,
      orderBy: { price: 'asc' },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const adminId = req.user?.adminProfileId;
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const productId = req.params.productId;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  const parsedProductId = parseInt(productId, 10);
  if (isNaN(parsedProductId)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  const productFromDB = await prisma.product.findUnique({
    where: { id: parsedProductId }
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

  const { name, description, price, quantity } = req.body;
  const updatedProduct: any = {};


  if (name != null) {
    if (typeof name !== 'string') {
      res.status(400).json({ message: "'name' must be a string" });
      return;
    }
    if (name !== productFromDB.name) {
      const duplicate = await prisma.product.findFirst({
        where: {
          storeId: storeId,
          name: name,
          NOT: { id: parsedProductId }
        }
      });
      if (duplicate) {
        res.status(400).json({ message: "A product with this name already exists in this store" });
        return;
      }
      updatedProduct.name = name;
    }
  }

  if (description != null) {
    if (typeof description !== 'string') {
      res.status(400).json({ message: "'description' must be a string" });
      return;
    }
    if (description !== productFromDB.description) {
      updatedProduct.description = description;
    }
  }

  if (price != null) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      res.status(400).json({ message: "'price' must be a valid number" });
      return;
    }
    if (parsedPrice !== Number(productFromDB.price)) {
      updatedProduct.price = parsedPrice;
    }
  }

  if (quantity != null) {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      res.status(400).json({ message: "'quantity' must be an integer" });
      return;
    }
    if (parsedQuantity !== productFromDB.quantity) {
      updatedProduct.quantity = parsedQuantity;
    }
  }

  if (Object.keys(updatedProduct).length === 0) {
    res.status(400).json({ message: "No valid changes provided" });
    return;
  }

  try {
    const updatedProductData = await prisma.product.update({
      where: { id: parsedProductId },
      data: updatedProduct
    });

    res.status(200).json({
      message: "Product updated successfully",
      updatedInfo: updatedProductData
    });

  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {

  const adminId = req.user?.adminProfileId;
  if (!adminId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  const productId = req.params.productId;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }
  const parsedProductId = parseInt(productId, 10);
  if (isNaN(parsedProductId)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  const productFromDB = await prisma.product.findUnique({
    where: { id: parsedProductId },
    include: { store: true }
  });
  if (!productFromDB) {
    res.status(404).json({ message: "Product not found in database" });
    return;
  }
  if (productFromDB.store.adminId !== adminId) {
    res.status(403).json({ message: "Not authorized to delete this product" });
    return;
  }

  try {
    const deletedproduct = await prisma.product.delete({
      where: { id: parsedProductId }
    })

    res.status(200).json({
      message: "Product deleted successfully",
      deleteProduct: deletedproduct
    })

  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Internal server error" });
  }

}
