import Link from "next/link";

export default function NavigationBar() {
    return (
        <div className={styles.nav_wrpper}>
            <Link href="/blog">
                <div className={styles.nav_item_wrapper}>
                    <div>Blog</div>
                </div>
            </Link>
            <Link href="/about">
                <div className={styles.nav_item_wrapper}>
                    <div>About</div>
                </div>
            </Link>
        </div>
    );
}

const styles = {
    nav_wrpper: "ml-16 flex items-center",
    nav_item_wrapper: "mr-8 flex items-center text-black text-sm cursor-pointer hover:text-blue-500 hover:font-semibold duration-300",
};