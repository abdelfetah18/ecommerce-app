import Link from "next/link";
import { getData } from "../../../database/client";
import { decodeJwt } from "jose";
import { motion, useAnimation } from "framer-motion";
import { FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import Header from "../../../components/Header";
import SideBar from "../../../components/SideBar";
import Orders from "../../../components/Orders";

export async function getServerSideProps({ req,params,query }){
    var user = decodeJwt(req.cookies.access_token);
    var user_info = await getData('*[_type=="users" && _id==$user_id]{_id,username,email,"profile_image":profile_image.asset->url}',{ user_id:user.user_id });
    var orders = await getData('*[_type=="orders" && user->username==$username]{_id,state,"products":products[]->{name,"images":images[].asset->url,price->,category->},payment_method,_createdAt}',{ username:user.username });
    
    return {
      props:{
        user:user_info[0],orders
      }
    }
  }

export default function MyOrders({ user, orders, theme, setTheme }){
    var products_slider = useRef();
    var product_images_slider = useRef();
    var [p_s,setPS] = useState(0);
    var [p_i_s,setPIS] = useState(0);
    var [selected_order,setSelectedOrder] = useState({ products:[{ name:"",images:[],price:{ value:0 },category:{ name:"" } }],state:"" });
    var order_dialog = useAnimation();
    var [o_d_open,setODOpen] = useState(false);

    useEffect(() => {
        products_slider.current.scrollTo({
            left:p_s,
            behavior:"smooth"
        });

        product_images_slider.current.scrollTo({
            left:p_i_s,
            behavior:"smooth"
        });
    },[p_s,p_i_s]);
    
    function toggleOrder(){
        if(o_d_open){
            order_dialog.start({
                opacity:0,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                order_dialog.set({ display:"none" });
                setODOpen(false);
            })
        }else{
            order_dialog.start({
                display:"flex",
                opacity:1,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                setODOpen(true);
            })
        }
    }

    function nextP(){
        if(p_s < products_slider.current.scrollWidth-(9)){
            setPS((state) => state+=products_slider.current.offsetWidth);
        } 
    }

    function prevP(){
        if(p_s > 0){
            setPS((state) => state-=products_slider.current.offsetWidth);
        }   
    }

    function nextPI(){
        if(p_i_s < product_images_slider.current.scrollWidth-(9)){
            setPIS((state) => state+=product_images_slider.current.offsetWidth);
        } 
    }

    function prevPI(){
        if(p_i_s > 0){
            setPIS((state) => state-=product_images_slider.current.offsetWidth);
        }   
    }


    return(
        <div className="flex flex-col items-center w-screen dark:bg-[#252936]">
            <Header user={{ profile_image: null }} theme={theme} setTheme={setTheme} />
            <div className="w-10/12 shadow-xl h-screen bg-gray-50 flex flex-row dark:bg-[#2c3040]">
                <SideBar key={"SideBar"} user={user} />
                <Orders key={"MyOrders"} orders={orders} selected_state={"Last orders"} setSelectedOrder={setSelectedOrder} toggleOrder={toggleOrder} />
            </div>
            <motion.div animate={order_dialog} className="absolute top-0 left-0 h-screen w-screen bg-[#00000099] hidden opacity-0 flex-col items-center justify-center">
                <div className="w-1/2 bg-gray-200 flex flex-col items-center dark:bg-[#2c3040] rounded-lg">
                    <div className="w-11/12 py-2 flex flex-row items-center justify-between">
                        <div className="text-lg font-medium dark:text-[#cbcbcb]">Order</div>
                        <div onClick={toggleOrder} className="cursor-pointer dark:text-[#cbcbcb]"><FaTimes /></div>
                    </div>
                    <div className="w-11/12 flex flex-col items-center">
                        <div className="relative w-11/12 flex flex-col items-center dark:bg-[#252936]">
                            <div ref={products_slider} className="w-1/2 overflow-hidden flex flex-row items-center">
                                {
                                    selected_order.products.map((p,i) => {
                                        return(
                                            <div key={i} className="min-w-full flex flex-col items-center dark:bg-[#2c3040] dark:border-2 dark:border-[#252936]">
                                                <div className="relative w-full h-60 flex flex-col items-center">
                                                    <div ref={product_images_slider} className="w-full h-60 flex flex-row items-center overflow-hidden dark:bg-[#252936] dark:border-2 dark:border-[#2c3040]">
                                                        {
                                                            p.images.map((img,i) => {
                                                                return(
                                                                    <div key={i} className="min-w-full h-60 flex flex-col items-center">
                                                                        <img className="h-full bg-white object-cover" src={img} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className="absolute top-1/2 w-full flex flex-row items-center justify-between">
                                                        <div onClick={prevPI} className="bg-black p-2 cursor-pointer">
                                                            <FaAngleLeft className="text-xl text-white"/>
                                                        </div>
                                                        <div onClick={nextPI} className="bg-black p-2 cursor-pointer">
                                                            <FaAngleRight className="text-xl text-white"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="w-full flex flex-col items-center">
                                                    <div className="w-full text-lg font-semibold py-2 dark:text-[#fff]">{p.name}</div>
                                                    <div className="w-full text-sm dark:text-[#cbcbcb]">{p.category.name}</div>
                                                    <div className="w-full text-base font-medium dark:text-[#fff]">${p.price.value}</div>
                                                </div>
                                                
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="absolute top-1/2 w-full flex flex-row items-center justify-between">
                                <div onClick={prevP} className="bg-black p-2 cursor-pointer">
                                    <FaAngleLeft className="text-xl text-white"/>
                                </div>
                                <div onClick={nextP} className="bg-black p-2 cursor-pointer">
                                    <FaAngleRight className="text-xl text-white"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-11/12 flex flex-col items-center py-2">
                            <div className="w-full flex flex-row items-center justify-between py-5">
                                <div className="text-lg font-bold dark:text-[#cbcbcb]">${selected_order.total}</div>
                                <div className="text-sm font-medium text-green-500 py-1 rounded-full bg-gray-300 px-4 dark:bg-[#252936]">{selected_order.state}</div>
                            </div>
                            <div className="text-sm font-medium w-full dark:text-[#cbcbcb]">on {(new Date(selected_order._createdAt)).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
} 