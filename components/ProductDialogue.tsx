import { FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Slider from "./Slider";

export default function ProductDialogue({ product, product_dialog_open, setDialogueOpen, isPreview }) {
    const product_animation = useAnimation();

    useEffect(() => {
        handleProductAnimation();
    }, [product_dialog_open]);

    function handleProductAnimation() {
        if (product_dialog_open) {
            product_animation.start({
                display: "flex",
                opacity: 1,
                transition: {
                    duration: 0.3
                }
            });
        } else {
            product_animation.start({
                opacity: 0,
                transition: {
                    duration: 0.3
                }
            }).then(() => {
                product_animation.set({
                    display: "none"
                });
            });
        }
    }

    function addToCart() {
        let myCart = localStorage.getItem('myCart');
        if (myCart != null) {
            let items = JSON.parse(myCart);
            let found = false;
            for (let i = 0; i < items.length; i++) {
                if (items[i]._id === product._id) {
                    found = true;
                }
            }
            if (found) {
                alert("already added!");
            } else {
                localStorage.setItem("myCart", JSON.stringify([...items, product]));
                closeDialogue();
            }
        } else {
            localStorage.setItem("myCart", JSON.stringify([product]));
            closeDialogue();
        }
    }

    function closeDialogue() {
        setDialogueOpen(false);
    }

    return (
        <motion.div animate={product_animation} className="hidden opacity-0 flex-col items-center justify-center absolute top-0 left-0 w-screen h-screen bg-[#00000099]">
            <div className="w-1/2 rounded-lg bg-white dark:bg-[#2c3040] shadow-xl flex flex-col items-center">
                <div className="w-full px-8 py-3 flex flex-row items-center justify-between border-b">
                    <div className="text-xl dark:text-[#cbcbcd] text-black">Product:</div>
                    <FaTimes onClick={closeDialogue} className="text-lg cursor-pointer dark:text-[#cbcbcd] text-gray-700" />
                </div>
                <div className="w-full flex flex-col items-center justify-center py-4">
                    <Slider images={product.images} />
                </div>
                <div className="w-11/12 flex flex-col items-center mb-20">
                    <div className="w-full font-medium text-xl dark:text-[#fff]">{product.name}</div>
                    <div className="w-full text-xs text-gray-400 dark:text-[#cbcbcd99] capitalize py-2">{product.category.name}</div>
                    <div className="w-full text-lg text-green-500">${product.price.value}</div>
                </div>
                {
                    !isPreview && (
                        <div onClick={addToCart} className="bg-blue-500 rounded-lg px-8 py-2 text-sm font-semibold text-white cursor-pointer my-4">ADD TO CART</div>
                    )
                }
            </div>
        </motion.div>
    );
}