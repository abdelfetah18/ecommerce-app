import { AiFillDashboard } from "react-icons/ai";

export default function Categories(){
    return(
        <div className={styles.container}>
            <div className={styles.header_wrapper} >
                <div className={styles.title} >Categories</div>
                <AiFillDashboard className={styles.dashboard_icon} />
            </div>
            
        </div>
    )
}

const styles = {
    container:"w-11/12 bg-[#252936] flex flex-col items-center overflow-auto",
    header_wrapper:"w-11/12 flex flex-row items-center justify-between mt-10",
    title:"font-medium text-[#cbcbcd]",
    dashboard_icon:"text-[#f5f5f5] text-xl",
}