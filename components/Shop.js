import Link from "next/link";
import Products from "./Products";

export default function Shop({ products, category_name }){
    return(
        <div className={styles.container}>
            <div className={styles.nav_wrapper}>
                <Link href="/"><div className={styles.directory}>Home</div></Link>
                <div className={styles.category}>{category_name}</div>
            </div>

            <Products products={products} isPreview={false} />
        </div>
    )
}

const styles = {
    container:"w-4/5 flex flex-col items-center px-4 h-full",
    nav_wrapper:"w-full flex flex-row items-center",
    directory:"text-sm font-semibold px-2 border-r-2 text-[#909090] dark:text-[#cbcbcd] cursor-pointer",
    category:"text-sm font-semibold px-2 cursor-pointer dark:text-[#fff] dark:font-bold",
};