import Link from "next/link";

export default function NavigationBar(){
    return (
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
    );
}

const styles = {
    navigation_wrpper:"flex flex-row w-1/3 items-center pl-5",
    navigation_text: "text-[#616161] dark:text-[#cbcbcd] text-sm font-bold text-base ml-4 cursor-pointer duration-300 ease-linear hover:text-red-500",
};