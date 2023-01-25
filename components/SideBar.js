import Link from "next/link";

export default function SideBar({ user }){
    
    return (
        <div className="w-1/4 h-screen flex flex-col items-center py-5 shadow-xl">
            <div className="w-11/12 flex flex-col items-center py-5">
                <img className="w-40 h-40 bg-gray-100 shadow-lg rounded-full" src={user.profile_image ? user.profile_image : "https://cdn.sanity.io/images/a6hagb75/production/fb17726fe38ca05bb9d8ac35b1dd3ad11ea4dbbf-752x748.jpg" } /> 
                <div className="text-xl font-semibold py-2 px-4 dark:text-[#cbcbcd]">{user.username}</div>
            </div>
            <div className="w-11/12 flex flex-col items-center py-5">
                <Link href={"/my_profile/my_orders"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 bg-gray-200 dark:bg-gray-900 rounded dark:text-[#cbcbcd] dark:hover:bg-gray-800">My orders</div></Link>
                <Link href={"/my_profile/payment_method"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 rounded dark:text-[#cbcbcd] dark:hover:bg-gray-800">Payment method</div></Link>
                <Link href={"/"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 rounded dark:text-[#cbcbcd] dark:hover:bg-gray-800">Shop</div></Link>
            </div>
        </div>
    )
}