import { useRouter } from "next/router";
import Header from "../components/Header";
import { useContext, useEffect, useState } from "react";
import StripeContext from "../contexts/StripeContext";
import Loading from "../components/Loading";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import ShoppingCartContext from "../contexts/ShoppingCartContext";

export default function PaymentConfirm() {
    const { verifyPaymentIntent } = useContext(StripeContext);
    const [, setShoppingCartItems] = useContext(ShoppingCartContext);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const paymentIntent = router.query.payment_intent;
        if (paymentIntent) {
            verifyPaymentIntentHandler(paymentIntent as string);
        }
    }, [router.query]);

    const verifyPaymentIntentHandler = async (paymentIntent: string) => {
        await verifyPaymentIntent(paymentIntent);
        setIsLoading(false);
        setShoppingCartItems([]);
    }

    return (
        <div className="w-full flex flex-col items-center overflow-auto bg-slate-50 dark:bg-[#252936]">
            <Header />
            <div className="w-11/12 flex flex-col mt-16">
                {
                    isLoading ? (
                        <div className="w-full flex flex-col items-center">
                            <Loading />
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <div className="text-9xl text-green-500">
                                <FaCheckCircle />
                            </div>
                            <div className="text-green-500 font-medium text-xl mt-2">Thank You!</div>
                            <div className="text-black font-medium text-xl mt-2">Payment done successfully</div>

                            <Link href="/profile/my_orders" className="bg-green-500 text-white font-semibold mt-16 text-xl px-16 py-2 rounded-full active:scale-105 duration-300">Go to My Order</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}