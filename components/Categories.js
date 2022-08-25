import Link from "next/link"

export default function Categories({ category_name,categories }){
    return(
        <div className={styles.container}>
            <div className={styles.cat_wrapper}>
                <Link href="/">
                    <div className={styles.cat+(category_name == "All" ? '' : 'text-[#000000aa]')}>All</div>
                </Link>
                {
                    categories.map((c,i) => {
                        return(
                            <Link key={i} href={"/categories/"+c.name}>
                                <div className={styles.cat+(category_name === c.name ? '' : 'text-[#000000aa]')}>{c.name}</div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

const styles = {
    container:"flex flex-row items-center justify-center w-full",
    cat_wrapper:"flex flex-row items-center justify-center bg-white w-5/6 py-2 border-b-2 border-r-2 border-l-2",
    cat:"mx-2 font-semibold  cursor-pointer hover:text-[#000000dd] "
}