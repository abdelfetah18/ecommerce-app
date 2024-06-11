interface UseStripeReturn {
    isStripeReady: boolean;
    stripeRef: MutableRefObject<Stripe>;
    createPaymentIntent: (order: Order) => Promise<ErrorOr<StripePaymentIntent>>;
    verifyPaymentIntent: (paymentIntent: string) => Promise<ErrorOr<undefined>>;
};

interface StripePaymentIntent {
    client_secret: string;
};