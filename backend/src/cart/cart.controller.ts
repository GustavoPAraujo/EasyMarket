import { Request, Response } from "express";
import prisma from "../services/prisma";

export const addItemToCart  = async (req: Request, res: Response): Promise<void> => {

  const clientId = req.user?.clientProfileId;  
  if (!clientId) {
    res.status(401).json({ message: "Client not authenticated" });
    return;
  }

  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    res.status(400).json({ message: "Missing productId or quantity" });
    return;
  }

  const parsedProductId = parseInt(productId, 10);
  const parsedQuantity = parseInt(quantity, 10);
  if (isNaN(parsedProductId) || isNaN(parsedQuantity)) {
    res.status(400).json({ message: "productId and quantity must be valid integers" });
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId }
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    
    let cart = await prisma.cart.findFirst({
      where: { clientId, status: 'ACTIVE' }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { 
          clientId, 
          status: 'ACTIVE'
        }
      });
    }
    
    let cartItem = await prisma.cartItem.findFirst({
      where: { 
        cartId: cart.id,
        productId: parsedProductId
      }
    });
    
    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { 
          quantity: cartItem.quantity + parsedQuantity
        }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parsedProductId,
          quantity: parsedQuantity,
          priceSnapshot: product.price,
          nameSnapshot: product.name
        }
      });
    }
    
    res.status(200).json({
      message: "Item added to cart successfully",
      cartItem
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
