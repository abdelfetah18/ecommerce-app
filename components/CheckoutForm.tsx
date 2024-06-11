import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import StripeContext from "../contexts/StripeContext";
import ToastContext from "../contexts/ToastContext";
import Loading from "./Loading";
import UserSessionContext from "../contexts/UserSessionContext";
import PayNowButton from "./PayNowButton";
import { STRIPE_TEST_MODE_NOTE } from "../utilities/consts";

interface CheckoutFormProps {
    order: Order;
};

export default function CheckoutForm({ order }: CheckoutFormProps) {
    const toastManager = useContext(ToastContext);
    const { stripeRef, createPaymentIntent } = useContext(StripeContext);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        getClientSecret();
    }, []);

    const getClientSecret = async () => {
        const result = await createPaymentIntent(order);
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            setClientSecret(result.value.client_secret);
        }
    }



    return (
        <div className="w-1/2 pt-4 pb-16 bg-white border rounded-lg flex flex-col items-center justify-center">
            <div className="w-11/12 text-black font-semibold text-lg py-2">Payment:</div>
            <div className="w-11/12 text-gray-500 text-xs py-2 whitespace-pre-line mb-8">{STRIPE_TEST_MODE_NOTE}</div>
            {
                clientSecret ? (
                    <Elements stripe={stripeRef.current} options={{ clientSecret }}>
                        <PaymentElement id="payment-element" options={{ layout: { type: "tabs" } }} />
                        <PayNowButton />
                    </Elements>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <Loading />
                    </div>
                )
            }
        </div>
    )
}