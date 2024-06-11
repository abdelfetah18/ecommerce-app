import { FaCartPlus, FaShoppingBasket } from "react-icons/fa";
import { BiCategory, BiPlusCircle } from "react-icons/bi";
import { AiFillDashboard, AiOutlineLayout } from "react-icons/ai";
import NavItem from "./NavItem";
import Link from "next/link";
import LayoutContentsContext from "../../contexts/LayoutContentsContext";
import { useContext, useEffect } from "react";

export default function Navigation({ page }) {
    const { logoLayout, getLogoLayout } = useContext(LayoutContentsContext);

    useEffect(() => {
        getLogoLayout();
    }, []);

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo_wrapper}>
                <img className={styles.logo} src={logoLayout?.image?.url || "/logo.png"} />
            </Link>

            <div className="flex flex-col flex-grow justify-center">
                {
                    navItems.map((item, index) => {
                        return (
                            <NavItem key={index} page={item} selected={item.page == page} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const styles = {
    container: "w-2/12 h-full bg-white border-r flex flex-col items-center",
    logo_wrapper: "h-28 w-28 my-5 active:scale-125 duration-300",
    logo: "h-full w-full object-cover rounded-full",
};

const navItems: DasboardPage[] = [
    {
        Icon: BiPlusCircle,
        name: "Create Product",
        page: "create_product",
        path: "/admin/create_product"
    },
    {
        Icon: AiFillDashboard,
        name: "Dashboard",
        page: "dashboard",
        path: "/admin/dashboard"
    },
    {
        Icon: FaShoppingBasket,
        name: "Orders",
        page: "orders",
        path: "/admin/orders"
    },
    {
        Icon: FaCartPlus,
        name: "Products",
        page: "products",
        path: "/admin/products"
    },
    {
        Icon: BiCategory,
        name: "Categories",
        page: "categories",
        path: "/admin/categories"
    },
    {
        Icon: AiOutlineLayout,
        name: "Layout Contents",
        page: "layout_contents",
        path: "/admin/layout_contents"
    },
];
