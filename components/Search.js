import { useEffect, useState } from "react";
import { FaSearch,FaChevronDown } from "react-icons/fa";
import DropDown from "./DropDown";
import axios from "axios";

export default function Search({ categories,search }){
    var [products,setProducts] = search;
    var [q,setQ] = useState('');

    async function searchFor(){
        try {
            var response = await axios.get("/api/user/search?q="+q,{ withCredentials:true });
        } catch (err) {
            console.log(err);
        } finally {
            if(response.data.status == "success"){
                setProducts(response.data.data);
            }else{
                console.log("failed!");
            }
        }
    }

    useEffect(() => {
        searchFor();
    },[q]);

    return(
        <div className={styles.container}>
            <div className={styles.search_wrapper}>
                <FaSearch className={styles.search_icon} />
                <input className={styles.search_input} onChange={(evt) => setQ(evt.target.value)} value={q} placeholder="search..." />
            </div>
            <div className={styles.wrapper}>
                <DropDown header={"Category"} items={categories} />
                <DropDown header={"Filters"} items={[{ name:"price" }]} />
                <DropDown header={"Sort By"} items={[{ name:"price" }]} />
            </div>
        </div>
    )
}

const styles = {
    container:"w-1/5 flex flex-col items-center bg-white shadow-xl py-4 h-full rounded-tr-lg",
    search_wrapper:"w-5/6 flex flex-row items-center rounded-xl bg-gray-100 ",
    search_icon:"w-1/6 h-8 py-2 text-[#909090]",
    search_input:"text-base font-medium w-5/6 px-2 bg-gray-100 rounded-xl text-[#616161]",
    wrapper:"w-5/6 flex flex-col items-center my-5",
    div_wrapper:"w-full flex flex-col items-center",
    div_header:"cursor-pointer text-base font-semibold w-full flex flex-row justify-between items-center px-2 py-1",
    div_body_wrapper:"hidden text-sm font-medium w-5/6 py-1",
    div_body_item:""
}