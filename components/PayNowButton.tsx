import { useContext, useState } from "react";
import StripeContext from "../contexts/StripeContext";
import { useElements } from "@stripe/react-stripe-js";
import Loading from "./Loading";

export default function PayNowButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { stripeRef } = useContext(StripeContext);
    const elements = useElements();

    const payNowHandler = async () => {
        setIsLoading(true);
        const { error } = await stripeRef.current.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/payment_confirm",
            },
        });

        setIsLoading(false);
        console.log("PayNowButton", { error });
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div onClick={payNowHandler} className="bg-primary-color mt-8 px-16 py-2 text-white rounded-full active:scale-105 duration-300 cursor-pointer">PayNow</div>
    )
}