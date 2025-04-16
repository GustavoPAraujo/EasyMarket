import { Request, Response } from "express";
import prisma from "../services/prisma/prisma";
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

  if(!orderId) {
    res.status(400).json({message: "Order not found"})
    return
  }
  console.log('order ID', orderId)

  const order = await prisma.order.findUnique({
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
        orderId: order.id.toString(),
        clientId: clientId.toString(),
      }
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//  .\stripe.exe listen --forward-to http://localhost:8000/api/payments/webhook
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {

  const sig = req.headers["stripe-signature"] as string;

  const buf = req.body as Buffer;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return 
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { 
            status: "PAID",
            paidAt: new Date()
          }
        });
        console.log(`Order ${orderId} marked as PAID.`);
      } catch (dbErr) {
        console.error("Error updating order:", dbErr);
      }
    }
  }

  res.json({ received: true });
};

export const paymentSuccess = (_: Request, res: Response) => {
  res.send("Your payment was successfull! Thanks for shopping with us.");
};

export const paymentCancel = (_: Request, res: Response) => {
  res.send("Payment canceld. You can try again when ever you want.");
};