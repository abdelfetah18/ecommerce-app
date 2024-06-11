import { useContext, useEffect, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { PayPalButtons, usePayPalScriptReducer, } from "@paypal/react-paypal-js";
import Header from "../components/Header";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import ShoppingCartContext from "../contexts/ShoppingCartContext";
import { PLACEHOLDER_IMAGE } from "../utilities/consts";
import CheckoutForm from "../components/CheckoutForm";
import Model from "../components/Model";
import useModel from "../hooks/useModel";

export default function CheckOut() {
    const [shoppingCart, setShoppingCart] = useContext(ShoppingCartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const useModelValue = useModel();

    useEffect(() => {
        const total = shoppingCart.reduce((accumulator, product) => accumulator + product.price.value, 0);
        console.log({ total });
        setTotalPrice(total);
    }, [shoppingCart]);

    const currencyCode = shoppingCart.length > 0 ? shoppingCart[0].price.currency : 'USD';

    function toggleCheckOutDialog() {
        useModelValue.open();
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.products_wrapper}>
                    {
                        shoppingCart.map((p, i) => {
                            function removeItem() {
                                setShoppingCart(shoppingCart.filter(e => e._id != p._id));
                            }

                            return (
                                <div key={i} className={styles.product_wrapper}>
                                    <div className={styles.p_image_wrapper}>
                                        <img className={styles.p_image} alt="product_image" src={p.images.length > 0 ? p.images[0].url : PLACEHOLDER_IMAGE} />
                                    </div>
                                    <div className={styles.p_info_wrapper}>
                                        <div className={styles.p_name}>{p.name}</div>
                                        <div className={styles.p_category}>{p.category.name}</div>
                                        <div className={styles.p_price}>{p.price.value} {p.price.currency}</div>
                                    </div>
                                    <div className={styles.p_actions_wrapper}>
                                        <div onClick={removeItem} className={styles.p_remove_wrapper}><FaTimes className={styles.p_remove} /></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.p_check_out_wrapper}>
                    <div className="flex items-center">
                        <div className="text-black mr-2 font-medium">Total:</div>
                        <div className={styles.p_totalPrice}>{parseFloat(totalPrice.toString()).toFixed(2)} {currencyCode}</div>
                    </div>
                    <div onClick={toggleCheckOutDialog} className={styles.p_check_out_button}>
                        <FaCheckCircle />
                        <div className="ml-2">CheckOut</div>
                    </div>
                </div>
            </div>

            <Model useModel={useModelValue} >
                <CheckoutForm order={{ products: shoppingCart, payment_method: 'stripe', state: 'Order Placed' }} />
            </Model>
        </div>
    )
}

const styles = {
    container: "w-screen h-screen flex flex-col items-center bg-gray-50 dark:bg-[#252936]",
    wrapper: "w-full flex flex-col items-center flex-grow  overflow-auto",
    products_wrapper: "w-1/2 flex flex-col items-center my-6 overflow-auto flex-grow",
    product_wrapper: "w-full flex flex-row items-center my-1",
    p_image_wrapper: "w-20 h-20 rounded-lg flex flex-col items-center bg-gray-100  shadow",
    p_image: 'h-full  object-contain rounded-lg',
    p_info_wrapper: "w-5/6 flex flex-col",
    p_name: "font-medium text-lg mx-2 dark:text-[#eee]",
    p_category: "text-xs text-gray-400 capitalize mx-2",
    p_price: "mx-2 text-green-500",
    p_actions_wrapper: "w-1/12 flex flex-col items-center",
    p_remove_wrapper: "p-2 rounded-lg cursor-pointer active:scale-110 duration-300",
    p_remove: "text-black text-lg",
    p_check_out_wrapper: "w-1/2 flex flex-row items-center justify-between border-t py-4",
    p_totalPrice: "text-xl font-medium text-green-500",
    p_check_out_button: "self-end px-16 py-1 rounded-full bg-primary-color hover:bg-blue-600 text-white m-2 flex items-center duration-300 active:scale-110 select-none cursor-pointer"
}