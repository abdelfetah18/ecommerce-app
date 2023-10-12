import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function ShoppingCart({ shopping_cart_open }){
    let shopping_cart_animation = useAnimation();
    let [shopping_cart_items,setShoppingCartItems] = useState([]);

    useEffect(() => {
        toggleShoppingCart();
    },[shopping_cart_open]);

    function toggleShoppingCart(){
        if(shopping_cart_open){
            shopping_cart_animation.start({
                opacity:0,
                transition:{
                    duration: 0.3
                }
            }).then(() => {
                shopping_cart_animation.set({
                    display:"none"
                });
            });
        }else{
            let myCart = localStorage.getItem('myCart');
            if(myCart != null){
                let items = JSON.parse(myCart);
                setShoppingCartItems(items);
            }
            shopping_cart_animation.start({
                opacity:1,
                display:"flex",
                transition:{
                    duration: 0.3
                }
            });
        }
    }

    return(
        <motion.div animate={shopping_cart_animation} className={styles.shopping_cart_wrapper}>
            <div className={styles.shopping_cart_header_wrapper}>
                <FaShoppingCart className={styles.shopping_cart_header_icon}/>
                <div className={styles.shopping_cart_header_title}>MY CART:</div>
            </div>
            { shopping_cart_items.length == 0 && (<div className="py-1 text-base dark:text-[#cbcbcd]">Empty</div>)}
            {
                shopping_cart_items.map((item,index) => {
                    function removeItem(){
                        let myCart = localStorage.getItem('myCart');
                        if(myCart != null){
                            let items = JSON.parse(myCart);
                            let newItems = [];
                            for(let i=0;i<items.length;i++){
                                if(items[i]._id != item._id){
                                    newItems.push(items[i]);
                                }
                            }
                            localStorage.setItem("myCart",JSON.stringify(newItems));
                            setShoppingCartItems(newItems);
                        }
                    }

                    return(
                        <div key={index} className={styles.shopping_cart_item_wrapper}>
                            <div className={styles.shopping_cart_item_image_wrapper}>
                                <img className={styles.shopping_cart_item_image} src={item.images[0].url} />
                            </div>
                            <div className={styles.shopping_cart_item_info_container}>
                                <div className={styles.shopping_cart_item_info_wrapper}>
                                    <div className={styles.shopping_cart_item_info_product_name}>{item.name}</div>
                                    <div className={styles.shopping_cart_item_info_product_category}>{item.category.name}</div>
                                </div>
                                <div className={styles.shopping_cart_item_info_product_price}>${item.price.value}</div>
                            </div>
                            <div onClick={removeItem} className={styles.shopping_cart_item_remove_wrapper}>
                                <FaTimes className={styles.shopping_cart_item_remove}/>
                            </div>
                        </div>
                    )
                })
            }
        </motion.div>
    );
}

const styles = {
    shopping_cart_wrapper:"w-96 absolute right-5 top-5 bg-[#fff] shadow-xl hidden opacity-0 flex-col items-center border-[1px] dark:bg-[#2c3040] rounded-lg dark:border-2 dark:border-[#252936]",
    shopping_cart_item_wrapper:"w-full flex flex-row items-center my-px",
    shopping_cart_item_image_wrapper:"p-2 w-16 h-16 rounded-lg",
    shopping_cart_item_image:"w-full h-full rounded-lg",
    shopping_cart_item_info_container:"flex flex-col flex-grow",
    shopping_cart_item_info_wrapper:"flex flex-row items-center justify-between",
    shopping_cart_item_info_product_name:"text-base font-semibold  dark:text-[#cbcbcd]",
    shopping_cart_item_info_product_category:"text-xs font-medium text-[#bdbdba]",
    shopping_cart_item_info_product_price:"font-bold dark:text-[#cbcbcd]",
    shopping_cart_item_remove_wrapper:"mx-2 flex flex-col items-center justify-center cursor-pointer p-2 bg-[#000000] dark:bg-[#252936] rounded ml-4",
    shopping_cart_item_remove:"text-lg text-[#ffffff]",
    shopping_cart_header_wrapper:"w-full flex flex-row items-center p-2 bg-gray-50 shadow dark:bg-[#252936]",
    shopping_cart_header_icon:"text-lg text-[#020202] mx-1 dark:text-[#cbcbcd]",
    shopping_cart_header_title:"text-base font-semibold text-[#] dark:text-[#cbcbcd]",
};