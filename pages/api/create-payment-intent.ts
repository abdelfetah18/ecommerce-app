import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../utilities/stripe";
import { createOrder } from "../../repositories/orders_repository";
import { jwtVerify } from "jose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const order: Order = req.body;

    const secret = Buffer.from(process.env.JWT_SECRET);
    const accessToken = req.headers["authorization"];
    const data = await jwtVerify(accessToken, secret, { algorithms: ["HS256"] });
    const user = data.payload as any;

    const newOrder = await createOrder({ ...order, user });

    const total = newOrder.products.reduce((sum, product) => sum + product.price.value, 0);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            orderId: newOrder._id
        }
    });

    const session: StripePaymentIntent = { client_secret: paymentIntent.client_secret };

    res.status(200).json({ status: 'success', message: 'Payment Intent Created Successfully', data: session });
}
