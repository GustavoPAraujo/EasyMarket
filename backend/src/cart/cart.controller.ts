import { Request, Response } from "express";
import prisma from "../services/prisma";

export const addItemToCart = async (req: Request, res: Response): Promise<void> => {

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

export const getCart = async (req: Request, res: Response): Promise<void> => {

  const clientId = req.user?.clientProfileId;
  if (!clientId) {
    res.status(401).json({ message: "Client not authenticated" });
    return;
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: {
        clientId: clientId,
        status: 'ACTIVE'
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      res.status(404).json({
        message: "This user has no active cart"
      });
      return;
    }

    res.status(200).json({
      message: "Cart Items",
      cart
    });

  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {

  const clientId = req.user?.clientProfileId;
  if (!clientId) {
    res.status(401).json({ message: "Client not authenticated" });
    return;
  }

  const itemIdParam = req.params.itemId;
  const itemId = parseInt(itemIdParam, 10);
  if (isNaN(itemId)) {
    res.status(400).json({ message: "Invalid item ID" });
    return;
  }

  try {

    const cart = await prisma.cart.findFirst({
      where: {
        clientId: clientId,
        status: 'ACTIVE'
      },
      include: {
        items: true
      }
    });
    if (!cart) {
      res.status(404).json({ message: "No active cart found for this client" });
      return;
    }

    const cartItem = cart.items.find((item) => item.id === itemId);
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found in the client's cart" });
      return;
    }

    const { delta } = req.body;
    const parsedDelta = parseInt(delta, 10);
    if (isNaN(parsedDelta)) {
      res.status(400).json({ message: "Delta must be a valid integer" });
      return;
    }

    const newQuantity = cartItem.quantity + parsedDelta;
    if (newQuantity <= 0) {
      const deleteItem = await prisma.cartItem.delete({
        where: {
          id: itemId
        }
      })
      if (!deleteItem){
        res.status(400).json({
          message: "Item could not be deleted"
        })
      }
      res.status(200).json({ message: "Item deleted successfuly" });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity }
    });
    if (!updatedItem) {
      res.status(400).json({
        message:"Items quantity could not be updated"
      })
      return
    }
    
    res.status(200).json({
      message:`Item ${updatedItem.nameSnapshot} quantity updated successfuly `,
      updatedItem
    })

  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteCartItem = async (req: Request, res: Response): Promise<void> => {

  const clientId = req.user?.clientProfileId;
  if (!clientId) {
    res.status(401).json({ message: "Client not authenticated" });
    return;
  }

  const itemIdParam = req.params.itemId;
  const itemId = parseInt(itemIdParam, 10);
  if (isNaN(itemId)) {
    res.status(400).json({ message: "Invalid item ID" });
    return;
  }

  try {

    const cart = await prisma.cart.findFirst({
      where: {
        clientId: clientId,
        status: 'ACTIVE'
      },
      include: {
        items: true
      }
    });
    if (!cart) {
      res.status(404).json({ message: "No active cart found for this client" });
      return;
    }

    const cartItem = cart.items.find((item) => item.id === itemId);
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found in the client's cart" });
      return;
    }

    const deletedItem = await prisma.cartItem.delete({
      where: { id: itemId }
    });
    
    res.status(200).json({ message: "Cart item deleted successfully", deletedItem });
    
  } catch(err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

