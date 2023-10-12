import Link from "next/link";

export default function Logo(){
    return(
        <div className={styles.logo_wrapper}>
            <Link href="/">
                <div className={styles.logo}>Company-Name</div>
            </Link>
        </div>
    );
}

const styles = {
    logo_wrapper:"flex flex-row w-1/3 items-center justify-center",
    logo:"font-bold text-xl text-center dark:text-white",
};