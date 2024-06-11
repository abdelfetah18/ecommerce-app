import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../utilities/stripe";
import { updateOrderState } from "../../repositories/orders_repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { payment_intent } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    const orderId = paymentIntent.metadata.orderId;
    if (orderId && paymentIntent.status == 'succeeded') {
        await updateOrderState(orderId, "Payment Processed");
    }

    res.status(200).json({ status: 'success', message: 'Payment Processed Successfully' });
}
