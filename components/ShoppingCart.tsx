import { FaCheckCircle, FaShoppingCart, FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import ShoppingCartContext from "../contexts/ShoppingCartContext";
import Link from "next/link";
import { PLACEHOLDER_IMAGE } from "../utilities/consts";

export default function ShoppingCart({ shopping_cart_open }) {
    let shopping_cart_animation = useAnimation();
    const [shoppingCartItems, setShoppingCartItems] = useContext(ShoppingCartContext);

    useEffect(() => {
        toggleShoppingCart();
    }, [shopping_cart_open]);

    function toggleShoppingCart() {
        if (shopping_cart_open) {
            shopping_cart_animation.start({
                opacity: 0,
                transition: {
                    duration: 0.3
                }
            }).then(() => {
                shopping_cart_animation.set({
                    display: "none"
                });
            });
        } else {
            let myCart = localStorage.getItem('myCart');
            if (myCart != null) {
                let items = JSON.parse(myCart);
                setShoppingCartItems(items);
            }
            shopping_cart_animation.start({
                opacity: 1,
                display: "flex",
                transition: {
                    duration: 0.3
                }
            });
        }
    }

    return (
        <motion.div animate={shopping_cart_animation} className={styles.shopping_cart_wrapper}>
            <div className={styles.shopping_cart_header_wrapper}>
                <FaShoppingCart className={styles.shopping_cart_header_icon} />
                <div className={styles.shopping_cart_header_title}>My Cart:</div>
            </div>
            {shoppingCartItems.length == 0 && (<div className="py-2 text-sm text-black dark:text-[#cbcbcd]">Empty</div>)}
            <div className={`w-full flex flex-col flex-grow overflow-auto ${shoppingCartItems.length > 0 ? 'border-b' : ''}`}>
                {
                    shoppingCartItems.map((item, index) => {
                        function removeItem() {
                            setShoppingCartItems(shoppingCartItems.filter(p => p._id != item._id));
                        }

                        return (
                            <div key={index} className={styles.shopping_cart_item_wrapper}>
                                <div className={styles.shopping_cart_item_image_wrapper}>
                                    <img className={styles.shopping_cart_item_image} src={item.images.length > 0 ? item.images[0].url : PLACEHOLDER_IMAGE} />
                                </div>
                                <div className={styles.shopping_cart_item_info_container}>
                                    <div className={styles.shopping_cart_item_info_product_name}>{item.name}</div>
                                    <div className={styles.shopping_cart_item_info_product_category}>{item.category.name}</div>
                                    <div className={styles.shopping_cart_item_info_product_price}>${item.price.value}</div>
                                </div>
                                <div onClick={removeItem} className={styles.shopping_cart_item_remove_wrapper}>
                                    <FaTimes className={styles.shopping_cart_item_remove} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                shoppingCartItems.length > 0 && (
                    <Link href={"/check_out"} className="self-end px-16 py-1 rounded-full bg-primary-color hover:bg-blue-600 text-white m-2 flex items-center duration-300 active:scale-110 select-none cursor-pointer">
                        <FaCheckCircle />
                        <div className="ml-2">CheckOut</div>
                    </Link>
                )
            }
        </motion.div>
    );
}

const styles = {
    shopping_cart_wrapper: "w-96 h-96 absolute right-5 top-5 bg-white shadow-xl hidden opacity-0 flex-col items-center border-[1px] dark:bg-[#2c3040] rounded-lg dark:border-2 dark:border-[#252936]",
    shopping_cart_item_wrapper: "w-full flex flex-row items-center my-2",
    shopping_cart_item_image_wrapper: "p-2 w-16 h-16 rounded-lg",
    shopping_cart_item_image: "w-full h-full rounded-lg object-contain aspect-square bg-gray-200",
    shopping_cart_item_info_container: "flex flex-col flex-grow",
    shopping_cart_item_info_product_name: "text-base font-medium text-black dark:text-[#cbcbcd]",
    shopping_cart_item_info_product_category: "text-xs text-gray-400 capitalize",
    shopping_cart_item_info_product_price: "text-green-500 text-sm",
    shopping_cart_item_remove_wrapper: "mx-2 flex flex-col items-center justify-center cursor-pointer p-2 text-black dark:bg-[#252936] rounded ml-4 duration-300 active:scale-110",
    shopping_cart_item_remove: "text-lg text-black",
    shopping_cart_header_wrapper: "w-full flex flex-row items-center p-2 bg-gray-50 shadow dark:bg-[#252936]",
    shopping_cart_header_icon: "text-lg text-[#020202] mx-1 dark:text-[#cbcbcd]",
    shopping_cart_header_title: "text-base font-semibold text-black dark:text-[#cbcbcd] select-none",
};