import { FaShoppingCart, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import NavigationBar from "./NavigationBar";
import Logo from "./Logo";
import ShoppingCart from "./ShoppingCart";
import Settings from "./Settings";

export default function Header({ user, theme, setTheme }) {
    let [settings_open,setSettingsOpen] = useState(true);
    let [shopping_cart_open,setShoppingCartOpen] = useState(true);
   
    return (
      <div className={styles.container}>
        <NavigationBar />
        <Logo />
        <div className={styles.icons_wrapper}>
            <div className="mx-4 cursor-pointer">
                { theme != "light" ? <FaSun className="text-white" onClick={() => setTheme("light")} /> : <FaMoon className="text-[#2c3040]" onClick={() => setTheme("dark")} /> } 
            </div>
            <Link href="/check_out">
                <div className={styles.check_out}>check out</div>
            </Link>
            <div className={styles.icon_wrapper}>
                <FaShoppingCart onClick={() => setShoppingCartOpen(state => !state)} className={styles.icon} />
                <ShoppingCart shopping_cart_open={shopping_cart_open} />
            </div>
            <div className={styles.icon_wrapper} >
                <FaCog onClick={() => setSettingsOpen(state => !state)} className={styles.icon} />
                <Settings settings_open={settings_open} user={user} />
            </div>
        </div>
      </div>
    )
}

const styles = {
    container:"flex flex-row w-11/12 py-4 items-center bg-white dark:bg-[#2c3040] dark:border-[#252936] border-slate-50 border-b-2 rounded-b-xl shadow",
    icons_wrapper:"flex flex-row w-1/3 items-center justify-end pr-5",
    icon_wrapper:"relative",
    icon:"text-[#616161] dark:text-[#cbcbcd] text-base mx-4 text-2xl cursor-pointer hover:text-gray-200",
    check_out:"duration-300 ease-linear font-bold uppercase text-sm mx-2 cursor-pointer text-blue-500 dark:text-blue-100 border-blue-500 dark:border-blue-100 border-2 px-2 rounded-full hover:text-black hover:border-black"
};