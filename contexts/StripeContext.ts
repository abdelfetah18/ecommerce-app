import { createContext } from "react";

export default createContext<UseStripeReturn>({
    isStripeReady: false,
    stripeRef: { current: null },
    createPaymentIntent: async (order: Order): Promise<ErrorOr<StripePaymentIntent>> => { order; return { isError: false }; },
    verifyPaymentIntent: async (paymentIntent: string): Promise<ErrorOr<undefined>> => { paymentIntent; return { isError: false }; }
});