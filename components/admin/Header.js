import { FaSearch,FaBell,FaCog } from "react-icons/fa";

export default function Header(){
    return(
        <div className={styles.container}>
            <div className="w-1/3 justify-between flex flex-row items-center">
                <div className={styles.logo}>Company-name</div>
                <div className={styles.search_wrapper}>
                    <FaSearch className={styles.search_icon} />
                    <input className={styles.search_input} placeholder="search products..." />
                </div>
            </div>
            <div className={styles.user_wrapper}>
                <FaBell className={styles.icons}/>
                <FaCog className={styles.icons}/>
                <div className={styles.user_image_wrapper}>
                    <img  className={styles.user_image} alt="user_image" src="https://i.pinimg.com/736x/b5/57/09/b55709cac5978000c13fddcba8b0c8f3.jpg" />
                </div>
            </div>
        </div>
    )
}

const styles = {
    container:"w-full h-16 flex flex-row items-center bg-black justify-between",
    logo:"text-white text-base font-bold text-center px-4 w-1/3",
    search_wrapper:"w-2/3 flex flex-row items-center rounded-xl bg-gray-100 mx-5",
    search_icon:"w-1/6 h-8 py-2 text-[#909090]",
    search_input:"w-11/12 text-base font-medium w-5/6 px-4 py-2 bg-gray-100 rounded-xl text-[#616161]",
    user_wrapper:"flex flex-row items-center",
    icons:"text-white mx-2 text-lg",
    user_image_wrapper:"h-10 w-10 rounded-full mx-2",
    user_image:"h-10 w-10 rounded-full"

}