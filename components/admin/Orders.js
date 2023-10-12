import { AiFillDashboard } from "react-icons/ai";
import { FaSearch,FaChevronUp } from "react-icons/fa";
import { useAnimation,motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import Order from "./Order";
import { IoMdMore } from "react-icons/io";


export default function Orders({ orders }){
    let search_input = useAnimation();
    let search_open = false;

    function toggleSearch(evt){
        if(search_open){
            search_input.start({
                width:0,
            }).then(() => {
                search_open = false;
            })
        }else{
            search_input.start({
                width:"fit-content",
            }).then(() => {
                search_open = true;
            })
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.header_wrapper} >
                <div className={styles.title} >Orders</div>
                <AiFillDashboard className={styles.dashboard_icon} />
            </div>
            <div className={styles.orders_container}>
                <div className={styles.orders_header_container}>
                    <div className={styles.orders_header_wrapper}>
                        <div className={styles.orders_header_title}>Last orders</div>
                        <FaSearch onClick={toggleSearch} className={styles.orders_header_search}/>
                        <motion.input animate={search_input} className={styles.orders_header_search_input} placeholder="search..." />
                    </div>
                    <div>
                        <IoMdMore className={styles.orders_header_more}/>
                    </div>
                </div>
                <div className={styles.orders_wrapper}>
                    <div className={styles.orders_table_head}>
                        <div className={styles.orders_table_value}>Name</div>
                        <div className={styles.orders_table_value}>Order</div>
                        <div className={styles.orders_table_value}>Date</div>
                        <div className={styles.orders_table_value}>State</div>
                        <div className={styles.orders_table_value}>Payment method</div>
                    </div>
                    {
                        orders.map((order,i) => {
                            return( <Order key={i} order={order} /> )
                        })
                    }
                </div>
            </div>
            
        </div>
    )
}

const styles = {
    container:"w-11/12 bg-[#252936] flex flex-col items-center overflow-auto",
    header_wrapper:"w-11/12 flex flex-row items-center justify-between mt-10",
    title:"font-medium text-[#cbcbcd]",
    dashboard_icon:"text-[#f5f5f5] text-xl",
    orders_container:"w-11/12 flex flex-col items-center rounded-lg mt-5 bg-[#2c3040] my-4 py-4",
    orders_header_container:"w-11/12 flex flex-row items-center justify-between py-2",
    orders_header_wrapper:"flex flex-row items-center w-11/12",
    orders_header_title:"text-[#bbbbbf] font-medium text-lg mx-2",
    orders_header_search:"text-[#bbbbbf] ml-4 cursor-pointer",
    orders_header_more:"text-[#bbbbbf] text-lg",
    orders_wrapper:"w-11/12 flex flex-col justify-between my-2",
    orders_table_head:"w-full flex flex-row items-center rounded-lg p-2 my-1",
    orders_table_values:"w-full flex flex-row items-center rounded-lg bg-[#252936] p-2 my-1",
    orders_table_value:"w-1/5 text-[#87878a] font-medium text-sm",
    orders_user_wrapper:"w-1/5 flex flex-row items-center",
    orders_user_image:"h-10 w-10 rounded-full",
    orders_user_name:"text-[#87878a] font-medium text-sm ml-2",
    orders_table_actions_btn_wrapper:"relative",
    orders_table_actions_btn:"text-lg cursor-pointer",
    orders_table_actions_wrapper:"hidden absolute right-2 w-40 rounded-lg flex-col items-center bg-[#2c3040] shadow-xl",
    orders_table_action:"px-4 py-2 cursor-pointer",
    orders_header_search_input:"ml-2 w-0 text-[#bbbbbf] py-1 bg-transparent border-[#bbbbbf] font-semibold border-b-2",
    states_wrapper:"absolute rounded-lg p-1 hidden flex-col items-center bg-[#2c3040] shadow-xl",
    states:"px-4 py-2 cursor-pointer hover:bg-[#1c2030] rounded-lg w-11/12 text-center"
}