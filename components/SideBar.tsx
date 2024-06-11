import Link from "next/link";
import { FaFirstOrder, FaList, FaListAlt, FaListOl, FaRegListAlt, FaRegUser, FaThList, FaUserCheck, FaUserCircle } from "react-icons/fa";

interface SideBarProps {
    selectedTab: 'my-account' | 'my-orders';
}

export default function SideBar({ selectedTab }: SideBarProps) {

    return (
        <div className="w-1/6 border-r h-screen flex flex-col items-center py-5">
            <div className="w-full text-black text-lg mt-10">Profile Information</div>
            <div className="w-5/6 flex flex-col items-center py-6">
                <Link href={"/profile/my_account"} className={`w-11/12 flex items-center mb-4 cursor-pointer hover:text-primary-color duration-300 active:scale-105 ${selectedTab == 'my-account' ? 'text-primary-color' : 'text-black'}`}>
                    <FaUserCircle />
                    <div className="text-sm font-medium ml-2">My Account</div>
                </Link>

                <Link href={"/profile/my_orders"} className={`w-11/12 flex items-center cursor-pointer hover:text-primary-color duration-300 active:scale-105 ${selectedTab == 'my-orders' ? 'text-primary-color' : 'text-black'}`}>
                    <FaRegListAlt />
                    <div className="text-sm font-medium ml-2">My Orders</div>
                </Link>
            </div>
        </div>
    )
}