import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Slider from "./Slider";
import Link from "next/link";

export default function Shop({ products,category_name }){
    var [selected_product,setSelectedProduct] = useState({ name:"",category:{ name:"" },price:{ value:"" },images:[] });
    var product_animation = useAnimation();
    var [product_dialog_open,setDialogueOpen] = useState(false);

    function toggleProduct(){
        if(product_dialog_open){
            product_animation.start({
                opacity:0,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                product_animation.set({
                    display:"none"
                });
                setDialogueOpen(false);
            });
        }else{
            product_animation.start({
                display:"flex",
                opacity:1,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                setDialogueOpen(true);
            });
        }
    }

    function addToCart(){
        var myCart = localStorage.getItem('myCart');
        if(myCart != null){
            var items = JSON.parse(myCart);
            var found = false;
            for(var i=0;i<items.length;i++){
                if(items[i]._id === selected_product._id){
                    found = true;
                }
            }
            if(found){
                alert("already added!");
            }else{
                localStorage.setItem("myCart",JSON.stringify([...items,selected_product]));
                toggleProduct();
            }
        }else{
            localStorage.setItem("myCart",JSON.stringify([selected_product]));
            toggleProduct();
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.nav_wrapper}>
                <Link href="/"><div className={styles.directory}>Home</div></Link>
                <div className={styles.category}>{category_name}</div>
            </div>
            <div className={styles.products_wrapper}>
                {
                    products.map((p,i) => {
                        function selectProduct(evt){
                            setSelectedProduct(p);
                            toggleProduct();
                        }

                        return(
                            <div key={i} className={styles.product_container}>
                                <div onClick={selectProduct} className={styles.product_wrapper}>
                                    <div className={styles.image_wrapper}>
                                        <img className={styles.image} src={p.images[0].url} />
                                    </div>
                                    <div className={styles.name}>{p.name}</div>
                                    <div className={styles.p_category}>{p.category.name}</div>
                                    <div className={styles.price}>${p.price.value}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <motion.div animate={product_animation} className="hidden opacity-0 flex-col items-center justify-center absolute top-0 left-0 w-screen h-screen bg-[#00000099]">
                <div className="w-1/2 rounded-lg bg-white dark:bg-[#2c3040] shadow-xl flex flex-col items-center">
                    <div className="w-full px-2 flex flex-orw items-center justify-between">
                        <div className="text-lg font-semibold dark:text-[#cbcbcd]">Product:</div>
                        <FaTimes onClick={toggleProduct} className="text-lg cursor-pointer dark:text-[#cbcbcd]" />
                    </div>
                    <Slider images={selected_product.images}/>
                    <div className="w-11/12 flex flex-col items-center">
                        <div className="w-full font-semibold text-lg dark:text-[#fff]">{selected_product.name}</div>
                        <div className="w-full font-medium text-sm text-[#9a9a9b] dark:text-[#cbcbcd99]">{selected_product.category.name}</div>
                        <div className="w-full font-semibold text-lg dark:text-[#cbcbcd]">${selected_product.price.value}</div>
                    </div>
                    <div onClick={addToCart} className="bg-blue-500 rounded-lg px-4 py-1 font-semibold text-white cursor-pointer my-4">Add to Cart</div>
                </div>
            </motion.div>
        </div>
    )
}

const styles = {
    container:"w-4/5 flex flex-col items-center px-4 h-full",
    nav_wrapper:"w-full flex flex-row items-center",
    directory:"text-sm font-semibold px-2 border-r-2 text-[#909090] dark:text-[#cbcbcd] cursor-pointer",
    category:"text-sm font-semibold px-2 cursor-pointer dark:text-[#fff] dark:font-bold",
    products_wrapper:"w-full flex flex-row flex-wrap mt-4",
    product_container:"flex flex-col w-1/4 my-4 items-center ",
    product_wrapper:"rounded flex flex-col w-11/12 items-center cursor-pointer hover:px-1  transition-linear duration-300 hover:shadow-xl",
    image_wrapper:"w-full rounded bg-gray-200 flex flex-col items-center",
    image:"h-52 object-contain rounded",
    name:"w-full font-semibold text-lg w-11/12 py-2 dark:text-[#cbcbcd]",
    p_category:"w-full font-semibold text-gray-600 text-sm w-11/12 py-2 dark:text-[#cbcbcd99]",
    price:"w-full font-semibold text-sm py-2 w-11/12  dark:text-[#cbcbcd] dark:font-bold"
};