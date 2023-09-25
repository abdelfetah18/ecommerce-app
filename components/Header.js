import { FaShoppingCart,FaUserCircle,FaCog, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { motion,useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header({ user, theme, setTheme }) {
    var shopping_cart_animation = useAnimation();
    var settingsAnimation = useAnimation();
    var [settings_open,setSettingsOpen] = useState(false);
    var [shopping_cart_items,setShoppingCartItems] = useState([]);
    var [shopping_cart_open,setShoppingCartOpen] = useState(false);

    function toggleShoppingCart(){
        if(shopping_cart_open){
            shopping_cart_animation.start({
                opacity:0,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                shopping_cart_animation.set({
                    display:"none"
                });
                setShoppingCartOpen(false);
            });
        }else{
            var myCart = localStorage.getItem('myCart');
            if(myCart != null){
                var items = JSON.parse(myCart);
                setShoppingCartItems(items);
            }
            shopping_cart_animation.start({
                opacity:1,
                display:"flex",
                transition:{
                    delay:0.3
                }
            }).then(() => {
                setShoppingCartOpen(true);
            });
        }
    }

    function toggleSettings(){
        if(settings_open){
            settingsAnimation.start({
                opacity:0,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                settingsAnimation.set({ display:"none" });
                setSettingsOpen(false);
            });
        }else{
            settingsAnimation.start({
                opacity:1,
                display:"flex",
                transition:{
                    duration:0.3
                }
            }).then(() => {
                setSettingsOpen(true);
            });
        }
    }

    return (
      <div className={styles.container}>
        <div className={styles.navigation_wrpper}>
            <Link href="/">
                <div className={styles.navigation_text}>Home</div>
            </Link>
            <Link href="/contact_me">
                <div className={styles.navigation_text}>Contact Me</div>
            </Link>
            <Link href="/about_me">
                <div className={styles.navigation_text}>About Me</div>
            </Link>
           
        </div>
        <div className={styles.logo_wrapper}>
            <Link href="/">
                <div className={styles.logo}>Company-Name</div>
            </Link>
        </div>
        <div className={styles.icons_wrapper}>
            <div className="mx-4 cursor-pointer">
                { theme != "light" ? <FaSun className="text-white" onClick={() => setTheme("light")} /> : <FaMoon className="text-[#2c3040]" onClick={() => setTheme("dark")} /> } 
            </div>
            <Link href="/check_out">
                <div className={styles.check_out}>check out</div>
            </Link>
            <div className={styles.icon_wrapper}>
                <FaShoppingCart onClick={toggleShoppingCart} className={styles.icon} />
                <motion.div animate={shopping_cart_animation} className={styles.shopping_cart_wrapper}>
                    <div className={styles.shopping_cart_header_wrapper}>
                        <FaShoppingCart className={styles.shopping_cart_header_icon}/>
                        <div className={styles.shopping_cart_header_title}>MY CART:</div>
                    </div>
                    { shopping_cart_items.length == 0 && (<div className="py-1 text-base dark:text-[#cbcbcd]">Empty</div>)}
                    {
                        shopping_cart_items.map((item,index) => {
                            function removeItem(){
                                var myCart = localStorage.getItem('myCart');
                                if(myCart != null){
                                    var items = JSON.parse(myCart);
                                    var newItems = [];
                                    for(var i=0;i<items.length;i++){
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
            </div>
            {/*
                <FaUserCircle className={styles.icon} />
            */}
            <div className={styles.icon_wrapper} >
                <FaCog onClick={toggleSettings} className={styles.icon} />
                <motion.div animate={settingsAnimation} className="absolute right-8 top-8 hidden opacity-0 flex-col items-center py-2 w-60 bg-gray-100 dark:bg-[#2c3040] rounded-lg dark:border-2 dark:border-[#252936] shadow-xl">
                    <Link href={"/my_profile/my_orders"}>
                        <div className="flex flex-row my-1 w-11/12 items-center ease-linear duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2">
                            <div className="w-10 flex flex-col items-center">
                                <img className="h-10 w-10 rounded-full bg-white" src={user.profile_image ? user.profile_image : "https://cdn.sanity.io/images/a6hagb75/production/fb17726fe38ca05bb9d8ac35b1dd3ad11ea4dbbf-752x748.jpg" } />
                            </div>
                            <div className="w-5/6 flex flex-col items-center">
                                <div className="text-sm font-medium w-11/12 dark:text-[#cbcbcd]">{user.username}</div>
                                <div className="text-xs text-gray-400 w-5/6">view profile</div>
                            </div>
                        </div>
                    </Link>
                    <Link href={"/user/sign_out"}><div className="mt-4 w-11/12 text-center font-semibold py-1 cursor-pointer ease-linear duration-300 bg-gray-200 dark:bg-[#252936] dark:text-[#cbcbcd] rounded-lg hover:bg-gray-300">sign out</div></Link>
                </motion.div>
            </div>
        </div>
      </div>
    )
}

const styles = {
    container:"flex flex-row w-11/12 py-4 items-center bg-white dark:bg-[#2c3040] dark:border-[#252936] border-slate-50 border-b-2 rounded-b-xl shadow",
    navigation_wrpper:"flex flex-row w-1/3 items-center pl-5",
    navigation_text: "text-[#616161] dark:text-[#cbcbcd] text-sm font-bold text-base ml-4 cursor-pointer duration-300 ease-linear hover:text-red-500",
    logo_wrapper:"flex flex-row w-1/3 items-center justify-center",
    logo:"font-bold text-xl text-center dark:text-white",
    icons_wrapper:"flex flex-row w-1/3 items-center justify-end pr-5",
    icon_wrapper:"relative",
    icon:"text-[#616161] dark:text-[#cbcbcd] text-base mx-4 text-2xl cursor-pointer hover:text-gray-200",
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
    check_out:"duration-300 ease-linear font-bold uppercase text-sm mx-2 cursor-pointer text-blue-500 dark:text-blue-100 border-blue-500 dark:border-blue-100 border-2 px-2 rounded-full hover:text-black hover:border-black"
}