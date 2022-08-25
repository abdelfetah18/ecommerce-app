import { FaCartPlus,FaShoppingBasket } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { AiFillDashboard } from "react-icons/ai";
import Link from "next/link";

export default function Navigation({ page }){
    return(
        <div className={styles.container}>
            <div className={styles.logo_wrapper}>
                <img className={styles.logo} src="/logo.png" />
            </div>
            <Link href="/admin/dashboard" >
                <div className={styles.nav_wrapper+(page === "dashboard" ? styles.selected_bg : "")}>
                    <AiFillDashboard className={styles.nav} />
                </div>
            </Link>
            <Link href="/admin/orders" >
                <div className={styles.nav_wrapper+(page === "orders" ? styles.selected_bg : "")}>
                    <FaShoppingBasket className={styles.nav} />
                </div>
            </Link>
            <Link href="/admin/products">
                <div className={styles.nav_wrapper+(page === "products" ? styles.selected_bg : "")}>
                    <FaCartPlus className={styles.nav} /> 
                </div>
            </Link>
            <Link href="/admin/categories">
                <div className={styles.nav_wrapper+(page === "categories" ? styles.selected_bg : "")}>
                    <BiCategory className={styles.nav} />
                </div>
            </Link>
            
        </div>
    )
}

const styles = {
    container:"w-1/12 h-full bg-[#2c3040] flex flex-col items-center",
    logo_wrapper:"h-16 w-16 my-5",
    logo:"h-16 w-16 object-cover bg-[#f5f5f5] rounded-xl",
    nav:"text-[#f5f5f5] text-3xl cursor-pointer",
    nav_wrapper:"p-3 my-5 rounded-lg",
    selected_bg:" bg-[#252936]"
}