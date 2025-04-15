import { Request, Response } from "express";
import prisma from "../services/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-03-31.basil" });

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {

  const clientId = req.user?.clientProfileId;
  if (!clientId) {
    res.status(401).json({ message: "Client not authenticated" });
    return;
  }

  const { orderId } = req.body;

  const order = await prisma.order.findFirst({
    where: { 
      id: orderId,
      status: "PENDING"
     },
    include: {
      items: true
    }
  })
  if (!order) {
    res.status(400).json({message: "Order not found"})
    return;
  }
  if (!order?.items || order.items.length === 0 ) {
    res.status(400).json({message: "Order items not found"})
    return;
  }

  const stripeLineItems = order.items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(Number(item.price) * 100), 
    },
    quantity: item.quantity,
  }));
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${process.env.PAYMENT_API_URL}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PAYMENT_API_URL}/api/payments/cancel`,
      metadata: {
        clientId: clientId.toString(),
      }
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

