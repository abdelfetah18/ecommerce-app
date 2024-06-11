import { FaShoppingCart, FaSignInAlt, FaSearch, FaUserCircle, FaSignOutAlt, FaAngleDown } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import NavigationBar from "./NavigationBar";
import Logo from "./Logo";
import ShoppingCart from "./ShoppingCart";
import UserSessionContext from "../contexts/UserSessionContext";
import { PROFILE_IMAGE_PLACEHOLDER } from "../utilities/consts";
import { useRouter } from "next/router";
import { AiFillLayout } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import ToastContext from "../contexts/ToastContext";
import LayoutContentsContext from "../contexts/LayoutContentsContext";

export default function Header() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const toastManager = useContext(ToastContext);
    const { isValid, userSession, updateUserSession } = useContext(UserSessionContext);
    const [shopping_cart_open, setShoppingCartOpen] = useState(true);
    const { logoLayout, getLogoLayout } = useContext(LayoutContentsContext);
    const [isOpen, setIsOpen] = useState(false);
    const { signInAsGuest } = useAuth();

    useEffect(() => {
        getLogoLayout();
    }, []);

    const viewDashboardAsGuest = async () => {
        const response = await signInAsGuest();
        if (response.isError) {
            toastManager.alertError("Error", response.message);
        } else {
            toastManager.alertSuccess("Success", response.message);
            updateUserSession(response.value);
            router.push("/admin/dashboard");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner_wrapper}>
                <Logo logoUrl={logoLayout.image?.url || "/logo.png"} />
                <NavigationBar />
                <div className="flex-grow"></div>
                <div className={styles.icons_wrapper}>
                    <form onSubmit={(ev) => { ev.preventDefault(); router.push({ pathname: '/search', query: { query } }); }} className="w-96 flex items-center rounded-full bg-gray-200 mr-4">
                        <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Search for items, categories..." className="bg-transparent flex-grow px-6 py-2 placeholder:text-gray-400 text-black" />
                        <div className="px-6 text-gray-400">
                            <FaSearch />
                        </div>
                    </form>

                    <div className={styles.icon_wrapper}>
                        <div onClick={() => setShoppingCartOpen(state => !state)} className="h-8 w-8 bg-primary-color rounded-full flex items-center justify-center ml-4 active:scale-125 duration-300 cursor-pointer select-none">
                            <FaShoppingCart className={`${styles.icon} text-white`} />
                        </div>
                        <ShoppingCart shopping_cart_open={shopping_cart_open} />
                    </div>
                    {
                        isValid && (
                            <div className="relative">
                                <div onClick={() => setIsOpen(state => !state)} className="flex items-center text-sm font-semibold ml-8 cursor-pointer active:scale-105 duration-300 select-none">
                                    <img src={userSession.user?.profile_image?.url || PROFILE_IMAGE_PLACEHOLDER} className="h-8 w-8 rounded-full bg-black object-cover shadow" />
                                    <div className="mx-2">{userSession.user.username}</div>
                                    <FaAngleDown />
                                </div>
                                <AnimatePresence>
                                    {
                                        isOpen && (
                                            <motion.div
                                                variants={{
                                                    open: { opacity: 1, marginTop: 0 },
                                                    close: { opacity: 0, marginTop: -10 }
                                                }}
                                                initial='close'
                                                animate='open'
                                                exit='close'
                                                className="absolute right-0 top-full w-60 bg-white border rounded-xl shadow-md flex flex-col py-2"
                                            >
                                                <Link href="/profile/my_account" className="w-full flex items-center px-8 hover:bg-gray-100 text-black text-sm active:scale-105 select-none duration-300 cursor-pointer py-2">
                                                    <div><FaUserCircle /></div>
                                                    <div className="ml-2">My account</div>
                                                </Link>
                                                {
                                                    userSession.user.role == 'admin' ? (
                                                        <Link href={"/admin/dashboard"} className="w-full flex items-center px-8 hover:bg-gray-100 text-black text-sm active:scale-105 select-none duration-300 cursor-pointer py-2">
                                                            <div><AiFillLayout /></div>
                                                            <div className="ml-2">Dashboard</div>
                                                        </Link>
                                                    ) : (
                                                        <div onClick={viewDashboardAsGuest} className="w-full flex items-center px-8 hover:bg-gray-100 text-black text-sm active:scale-105 select-none duration-300 cursor-pointer py-2">
                                                            <div><AiFillLayout /></div>
                                                            <div className="ml-2">Dashboard as guest</div>
                                                        </div>
                                                    )
                                                }
                                                <Link href="/user/sign_out" className="w-full flex items-center px-8 hover:bg-gray-100 text-black text-sm active:scale-105 select-none duration-300 cursor-pointer py-2">
                                                    <div><FaSignOutAlt /></div>
                                                    <div className="ml-2">Log out</div>
                                                </Link>
                                            </motion.div>
                                        )
                                    }
                                </AnimatePresence>
                            </div>
                        )
                    }
                    {
                        !isValid && (
                            <Link href="/user/sign_in" className="flex items-center text-sm font-semibold ml-4 cursor-pointer active:scale-105 duration-300 select-none">
                                <FaSignInAlt />
                                <div className="ml-2">Login</div>
                            </Link>
                        )
                    }
                </div>
            </div >

        </div >
    )
}

const styles = {
    container: "w-full flex flex-col items-center py-4 bg-white border-slate-50 border-b-2 shadow",
    icons_wrapper: "flex items-center",
    icon_wrapper: "relative",
    icon: "dark:text-[#cbcbcd] cursor-pointer hover:text-gray-200",
    check_out: "duration-300 ease-linear font-bold uppercase text-sm mx-2 cursor-pointer text-blue-500 dark:text-blue-100 border-blue-500 dark:border-blue-100 border-2 px-2 rounded-full hover:text-black hover:border-black",
    inner_wrapper: 'w-11/12 flex items-center'
};