import { useEffect, useState } from "react";
import { FaSearch,FaChevronDown } from "react-icons/fa";
import DropDown from "./DropDown";
import axios from "axios";

export default function Search({ categories, search }){
    const [products, setProducts] = search;
    const [query,setQuery] = useState('');
    const [filters, setFilters] = useState({});

    async function searchFor(){
        try {
            let response = await axios.post("/api/search",{ query, filters },{ withCredentials: true });
            if(response.data.status == "success"){
                setProducts(response.data.data);
            }else{
                console.log("failed!");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(query.length > 0){
            searchFor();
        }
    },[query, filters]);

    return(
        <div className={styles.container}>
            <div className={styles.search_wrapper}>
                <FaSearch className={styles.search_icon} />
                <input className={styles.search_input} onChange={(evt) => setQuery(evt.target.value)} value={query} placeholder="Search..." />
            </div>
            <div className={styles.wrapper}>
                <DropDown filter_type={"category"} header={"Category"} items={categories} useFilters={[filters, setFilters]} />
                <DropDown filter_type={"order_by"} header={"Sort By"} items={["price","name"]} useFilters={[filters, setFilters]} />
            </div>
        </div>
    )
}

const styles = {
    container:"w-1/5 flex flex-col items-center bg-white dark:bg-[#2c3040] shadow-xl py-4 h-full rounded-t-lg",
    search_wrapper:"w-11/12 flex flex-row items-center rounded-lg bg-gray-100 dark:bg-[#252936]",
    search_icon:"w-1/6 h-8 py-2 text-[#909090]",
    search_input:"text-base font-medium w-5/6 px-2 bg-gray-100 rounded-xl text-[#ebebeb] dark:bg-[#252936]",
    wrapper:"w-5/6 flex flex-col items-center my-5",
    div_wrapper:"w-full flex flex-col items-center",
    div_header:"cursor-pointer text-base font-semibold w-full flex flex-row justify-between items-center px-2 py-1",
    div_body_wrapper:"hidden text-sm font-medium w-5/6 py-1",
    div_body_item:""
}