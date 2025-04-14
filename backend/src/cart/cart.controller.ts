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
      where: { clientId }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          clientId,
          status: 'ACTIVE'
        }
      });
    } else if (cart.status === 'CHECKED_OUT') {

      const result = await prisma.$transaction( async (tx) => {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart?.id }
        });
        cart = await prisma.cart.update({
          where: { id: cart?.id },
          data: { status: 'ACTIVE' }
        });
      })
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

export const getCartSummary = async (req: Request, res: Response): Promise<void> => {

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
    })
    if (!cart) {
      res.status(404).json({
        message: "This user has no active cart"
      });
      return;
    }

    let totalPrice = 0
    let totalQuantity = 0
    cart.items.forEach((item) => {
      const price = Number(item.priceSnapshot || item.product.price);
      totalQuantity += item.quantity;
      totalPrice += price * item.quantity;
    })

    res.status(200).json({
      message:"Cart items Summary",
      total_quantity: totalQuantity,
      total_price: totalPrice,
      items: cart.items
    })

  } catch(err) {
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
      if (!deleteItem) {
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
        message: "Items quantity could not be updated"
      })
      return
    }

    res.status(200).json({
      message: `Item ${updatedItem.nameSnapshot} quantity updated successfuly `,
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

  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllItems = async (req: Request, res: Response): Promise<void> => {

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
        items: true
      }
    });
    if (!cart) {
      res.status(404).json({ message: "No active cart found for this client" });
      return;
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    if (deleted.count === 0) {
      res.status(200).json({
        message: "Cart is already empty",
        deletedCount: deleted.count
      });
    }

    res.status(200).json({
      message: "All items deleted from cart successfully",
      deletedCount: deleted.count
    });
    
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const checkout = async (req: Request, res: Response): Promise<void> => {

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
      res.status(404).json({ message: "No active cart found for this client" });
      return;
    }
    if (cart.items.length === 0){
      res.status(400).json({ message: "No items added to cart" });
      return;
    }
    //validar se os itens ainda tem disponibilidade  (!!!!!!!!!!) nao esquecer
    const insufficientItems: string[] = [];
    cart.items.forEach((item) => {

      if (item.quantity > item.product.quantity) {
        insufficientItems.push(`Product '${item.product.name}' has ${item.product.quantity} in stock, but ${item.quantity} was requested.`);
      }
    });

    if (insufficientItems.length > 0) {
      res.status(400).json({
        message: "Some items do not have sufficient stock.",
        details: insufficientItems
      });
      return;
    }

    let totalPrice = 0
    cart.items.forEach((item) => {
      const price = Number(item.priceSnapshot || item.product.price);
      totalPrice += price * item.quantity;
    })


    const result = await prisma.$transaction(async (tx) => {
      const updatedCart = await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'CHECKED_OUT' }
      });
    
      const order = await tx.order.create({
        data: {
          clientId: clientId,
          status: 'PENDING',
          totalPrice: totalPrice,
        }
      });
    
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.priceSnapshot || item.product.price,
            name: item.nameSnapshot || item.product.name
          }
        });
        
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }
    
      return { updatedCart, order };
    });

    const {updatedCart, order} = result

    res.status(200).json({
      message: "Checkout completed successfully",
      totalPrice,
      orderId: order.id,
      orderStatus: order.status,
      cartId: updatedCart.id,
      status: updatedCart.status
    });

  } catch(err) {
    console.error("Error during checkout:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
