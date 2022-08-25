import Link from "next/link";
import { getData } from "../../../database/client";
import { decodeJwt } from "jose";
import { motion, useAnimation } from "framer-motion";
import { FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

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

export default function MyOrders({ user,orders }){
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
        <div className="flex flex-col items-center w-screen">
            <div className="w-11/12 shadow-xl h-screen bg-gray-50 flex flex-row">
                <div className="w-1/4 h-screen flex flex-col items-center py-5 shadow-xl">
                    <div className="w-11/12 flex flex-col items-center py-5">
                        <img className="w-40 h-40 bg-gray-100 shadow-lg rounded-full" src={user.profile_image ? user.profile_image : "https://cdn.sanity.io/images/a6hagb75/production/fb17726fe38ca05bb9d8ac35b1dd3ad11ea4dbbf-752x748.jpg" } /> 
                        <div className="text-xl font-semibold py-2 px-4">{user.username}</div>
                    </div>
                    <div className="w-11/12 flex flex-col items-center py-5">
                        <Link href={"/my_profile/my_orders"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 bg-gray-200 rounded">My orders</div></Link>
                        <Link href={"/my_profile/payment_method"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 rounded">Payment method</div></Link>
                        <Link href={"/"}><div className="text-sm font-medium py-2 px-4 w-full cursor-pointer hover:bg-gray-100 rounded">Shop</div></Link>
                    </div>
                </div>
                <div className="w-3/4 h-screen flex flex-col items-center bg-white">
                    <div className="w-11/12 flex flex-row items-center py-4">
                        <div className="text-xl font-bold">My orders:</div>
                    </div>
                    {
                    /*
                        <div className="w-11/12 flex flex-col items-center">
                            <div className="w-11/12 flex flex-row items-center">
                                <div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4">Last orders</div>
                                <div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4">All</div>
                                <div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4">Processing</div>
                                <div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4">Shipped</div>
                                <div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4">Delivered</div>
                            </div>
                            <div className="w-11/12 flex flex-col items-center my-5">
                                <div className="w-full flex flex-row items-center py-2 px-2 border-b-2">
                                    <div className="w-2/5 text-base font-medium">order_id</div>
                                    <div className="w-1/6 text-base font-medium">order state</div>
                                    <div className="w-1/6 text-base font-medium">Price</div>
                                    <div className="w-1/5 text-base font-medium">date</div>
                                </div>
                                <div className="w-full flex flex-row items-center py-2 my-1 px-2 bg-gray-100">
                                    <div className="w-2/5 text-sm text-gray-700">H8yYePJlyQjGMAjuJA2kH5</div>
                                    <div className="w-1/6 text-sm text-gray-700">Processing</div>
                                    <div className="w-1/6 text-sm text-gray-700">$58.99</div>
                                    <div className="w-1/5 text-sm text-gray-700">Wed Aug 17 2022</div>
                                </div>
                            </div>
                        </div>
                    */
                    }
                    <div className="w-11/12 flex flex-col items-center mb-5">
                        <div className="w-full flex flex-row items-center">
                            <Link href="/my_profile/my_orders"><div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4 cursor-pointer text-blue-500">Last orders</div></Link>
                            <Link href="/my_profile/my_orders/Processing"><div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4 cursor-pointer">Processing</div></Link>
                            <Link href="/my_profile/my_orders/Shipped"><div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4 cursor-pointer">Shipped</div></Link>
                            <Link href="/my_profile/my_orders/Delivered"><div className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md text-gray-600 mr-4 cursor-pointer">Delivered</div></Link>
                        </div>
                    </div>
                    <div className="w-11/12 flex flex-row flex-wrap">
                        {
                            orders.map((order,index) => {
                                
                                function getTotal(){
                                    var total = 0;
                                    for(var i=0;i<order.products.length;i++){
                                        total += parseFloat(order.products[i].price.value);
                                    }
                                    
                                    return parseFloat(total).toFixed(2);
                                }

                                function selectOrder(){
                                    console.log(order);
                                    setSelectedOrder({ ...order,total:getTotal() });
                                    toggleOrder();
                                }

                                return(
                                    <div key={index} className="w-1/4 flex flex-col flex-wrap items-center bg-gray-100 rounded-lg py-1 mx-1 my-1 hover:shadow-xl">
                                        <div className="flex flex-row items-center justify-between w-11/12">
                                            <div className="w-11/12 text-lg font-semibold my-2">${getTotal()}</div>
                                            <div className="text-sm font-medium text-green-500 px-3 py-1  rounded-full">{order.state}</div>
                                        </div>
                                        
                                        <div className="flex flex-row items-center w-11/12 my-2">
                                            <div className="text-sm font-normal mx-2">On </div>
                                            <div className="text-xs font-semibold text-gray-800">{(new Date(order._createdAt)).toLocaleString()}</div>
                                        </div>
                                        <div onClick={selectOrder} className="text-sm font-medium bg-blue-500 text-white rounded-full px-4 py-1 my-2 cursor-pointer">view order details</div>
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div>
            <motion.div animate={order_dialog} className="absolute top-0 left-0 h-screen w-screen bg-[#00000099] hidden opacity-0 flex-col items-center">
                <div className="w-1/2 bg-gray-200 flex flex-col items-center">
                    <div className="w-11/12 py-2 flex flex-row items-center justify-between">
                        <div className="text-lg font-medium">Order</div>
                        <div onClick={toggleOrder} className="cursor-pointer"><FaTimes /></div>
                    </div>
                    <div className="w-11/12 flex flex-col items-center">
                        <div className="relative w-11/12 flex flex-col items-center">
                            <div ref={products_slider} className="w-1/2 overflow-hidden flex flex-row items-center">
                                {
                                    selected_order.products.map((p,i) => {
                                        return(
                                            <div key={i} className="min-w-full flex flex-col items-center">
                                                <div className="relative w-full h-60 flex flex-col items-center">
                                                    <div ref={product_images_slider} className="w-full h-60 flex flex-row items-center overflow-hidden">
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
                                                    <div className="w-full text-lg font-semibold py-2">{p.name}</div>
                                                    <div className="w-full text-sm">{p.category.name}</div>
                                                    <div className="w-full text-base font-medium">${p.price.value}</div>
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
                                <div className="text-lg font-bold">${selected_order.total}</div>
                                <div className="text-sm font-medium text-green-500 py-1 rounded-full bg-gray-300 px-4">{selected_order.state}</div>
                            </div>
                            <div className="text-sm font-medium w-full">on {(new Date(selected_order._createdAt)).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
} 