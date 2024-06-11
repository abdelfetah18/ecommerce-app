import { useEffect, useRef, useState } from "react"
import getStripe from "../utilities/get-stripejs";
import { Stripe } from "@stripe/stripe-js";
import useAxiosHttp from "./useAxiosHttp";

export default function useStripe(): UseStripeReturn {
    const [isStripeReady, setIsStripeReady] = useState(false);
    const stripeRef = useRef<Stripe>(null);
    const axiosHttp = useAxiosHttp();

    useEffect(() => {
        getStripePromise();
    }, []);

    const getStripePromise = async () => {
        stripeRef.current = await getStripe();
        setIsStripeReady(true);
    }

    const createPaymentIntent = async (order: Order): Promise<ErrorOr<StripePaymentIntent>> => {
        const errorOr: ErrorOr<StripePaymentIntent> = { isError: false };

        const response = await axiosHttp.post<Order, StripePaymentIntent>("/create-payment-intent", order);

        if (response.status == 'success') {
            errorOr.value = response.data;
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        return errorOr;
    }

    const verifyPaymentIntent = async (paymentIntent: string): Promise<ErrorOr<undefined>> => {
        const errorOr: ErrorOr<undefined> = { isError: false };

        const response = await axiosHttp.post<{ payment_intent: string }, undefined>("/verify-payment-intent", { payment_intent: paymentIntent });

        if (response.status == 'success') {
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        return errorOr;
    }

    return {
        isStripeReady,
        stripeRef,
        createPaymentIntent,
        verifyPaymentIntent
    };
}