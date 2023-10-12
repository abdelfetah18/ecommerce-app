import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PayPalButtons,usePayPalScriptReducer, } from "@paypal/react-paypal-js";
import Header from "../components/Header";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { decodeJwt } from "jose";
import { getUser } from "../database/client";

export async function getServerSideProps({ req }){
    const user_session = decodeJwt(req.cookies.access_token);
    const user = await getUser(user_session.user_id);
    
    return {
      props:{ user }
    }
}

export default function CheckOut({ user, theme, setTheme }){
    let [shopping_cart,setShoppingCart] = useState([]);
    let [total_price,setTotalPrice] = useState(0);
    let [check_out_open,setCheckOutOpen] = useState(false);
    let Paypal = usePayPalScriptReducer();
    let checkoutDialog = useAnimation();

    useEffect(() => {
        let myCart = localStorage.getItem("myCart");
        if(myCart != null){
            let items = JSON.parse(myCart);
            setShoppingCart(items);
        } 
    },[]);

    useEffect(() => {
        console.log("shopping cart updated!");
        setTotalPrice(0);
        for(let i=0;i<shopping_cart.length;i++){
            setTotalPrice(state => state+=parseFloat(shopping_cart[i].price.value))
        }
    },[total_price,shopping_cart]);

    function createOrder(data,actions){
        if(total_price > 0){
            return actions.order.create({
                purchase_units: [
                    {
                      amount:{
                        currency_code:"USD",
                        value:parseFloat(total_price).toFixed(2),
                        breakdown:{
                            item_total:{
                                currency_code:"USD",
                                value:parseFloat(total_price).toFixed(2)  
                            },
                        }
                      },
                      items:(() => {
                        let list = [];
                        for(let i=0;i<shopping_cart.length;i++){
                                console.log()
                                list.push({
                                    name:shopping_cart[i].name,
                                    quantity:1,
                                    unit_amount:{
                                        currency_code:"USD",
                                        value:parseFloat(shopping_cart[i].price.value).toFixed(2)
                                    },
                                    description:"HelloWorld!"
                                });
                        }
                        return list;
                      })()
                    }
                ],
            });
        }else{
            alert("your cart is empty!");
        }   
    }
    
    function onApprove(data, actions) {
        axios.post("/api/user/check_out",{ orderId:data.orderID,shopping_cart },{ withCredentials:true, headers:{ "Content-Type":"application/json" }}).then((res) => {
            console.log(res);
            if(res.data.status == "success"){
                localStorage.removeItem("myCart");
                toggleCheckOutDialog();
                actions.order.capture();
                window.location.href = "/my_profile/my_orders";
            }else{
                console.log(res.data);
                alert("failed!");
            }
        }).catch((err) => console.log("err:",err));
       
    }

    function onCancel(data,actions){
        console.log(data);
    }

    function onError(data,actions){
        console.log(data);
    }

    function toggleCheckOutDialog(evt){
        if(check_out_open){
            checkoutDialog.start({
                top:"-100vh",
                opacity:0,
                transition:{
                    duration:0.5
                }
            }).then(() => {
                checkoutDialog.set({
                    display:"none"
                });
                setCheckOutOpen(false);
            });
        }else{
            checkoutDialog.start({
                display:"flex",
                top:0,
                opacity:1,
                transition:{
                    duration:0.5
                }
            }).then(() => {
                setCheckOutOpen(true);
            });
        }
    }

    return(
        <div className={styles.container}>
            <Header user={user} theme={theme} setTheme={setTheme} />
            <div className={styles.wrapper}>
                <div className={styles.products_wrapper}>
                    {
                        shopping_cart.map((p,i) => {
                            function removeItem(){
                                let myCart = localStorage.getItem('myCart');
                                if(myCart != null){
                                    let items = JSON.parse(myCart);
                                    let newItems = [];
                                    for(let i=0;i<items.length;i++){
                                        if(items[i]._id != p._id){
                                            newItems.push(items[i]);
                                        }
                                    }
                                    localStorage.setItem("myCart",JSON.stringify(newItems));
                                    setShoppingCart(newItems);
                                }
                            }

                            return(
                                <div key={i} className={styles.product_wrapper}>
                                    <div className={styles.p_image_wrapper}>
                                        <img className={styles.p_image} alt="product_image" src={p.images[0].url} />
                                    </div>
                                    <div className={styles.p_info_wrapper}>
                                        <div className={styles.p_name}>{p.name}</div>
                                        <div className={styles.p_category}>{p.category.name}</div>
                                        <div className={styles.p_price}>${p.price.value}</div>
                                    </div>
                                    <div className={styles.p_actions_wrapper}>
                                        <div onClick={removeItem} className={styles.p_remove_wrapper}><FaTimes className={styles.p_remove} /></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className={styles.p_check_out_wrapper}>
                        <div className={styles.p_total_price}>${parseFloat(total_price).toFixed(2)}</div>
                        <div onClick={toggleCheckOutDialog} className={styles.p_check_out}>Check Out</div>
                    </div>
                </div>
            </div>
            <motion.div animate={checkoutDialog} className="absolute opacity-0 flex flex-col items-center justify-center top-[-100vh] left-0 w-screen h-screen bg-[#00000099]">
                <div className="bg-white w-1/2 rounded-lg flex flex-col items-center dark:bg-[#252936]">
                    <div className="flex flex-row w-full items-center px-3 py-1 justify-between">
                        <div className="font-bold text-xl dark:text-[#cbcbcb]">Payment methods:</div>
                        <FaTimes onClick={toggleCheckOutDialog} className="text-lg cursor-pointer dark:text-[#cbcbcb]" />
                    </div>
                    <div className="font-semibold text-base dark:text-[#cbcbcb]">Pay with:</div>
                    <div className="my-2">
                        <PayPalButtons forceReRender={[total_price,shopping_cart]} onCancel={onCancel} onError={onError} onApprove={onApprove} createOrder={createOrder} />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const styles = {
    container:"w-screen h-screen flex flex-col items-center bg-gray-50 dark:bg-[#252936]",
    wrapper:"w-5/6 flex flex-col items-center",
    products_wrapper:"w-11/12 flex flex-col items-center py-5 ",
    product_wrapper:"w-1/2 flex flex-row items-center mx-5 my-1 rounded-lg bg-gray-200 dark:bg-[#2c3040]",
    p_image_wrapper:"w-20 h-20 rounded-lg flex flex-col items-center",
    p_image:'h-full rounded-lg shadow-lg',
    p_info_wrapper:"w-5/6 flex flex-col",
    p_name:"font-semibold text-lg mx-2 dark:text-[#eee]",
    p_category:"font-medium text-sm text-[#bebeba] mx-2",
    p_price:"font-semibold mx-2 dark:text-[#eee]",
    p_actions_wrapper:"w-1/12 flex flex-col items-center",
    p_remove_wrapper:"p-2 bg-black rounded-lg cursor-pointer dark:bg-[#252936]",
    p_remove:"text-white text-lg",
    p_check_out_wrapper:"w-1/2 flex flex-row items-center justify-between",
    p_total_price:"font-bold text-lg dark:text-[#cbcbcb]",
    p_check_out:"bg-blue-500 px-4 py-1 rounded-lg cursor-pointer font-bold text-[#eeeeee] my-5"
}