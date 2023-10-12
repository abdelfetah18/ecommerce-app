import axios from "axios";
import { useState } from "react";
import { useAnimation,motion } from "framer-motion";
import { IoMdMore } from "react-icons/io";


export default function Order({ order }){
    let [_order,setOrder] = useState(order);
    let menu_animation = useAnimation();
    let [change_state_open,setChangeStateOpen] = useState(false);
    let [open,setOpen] = useState(false);
    let states_animation = useAnimation();

    function toggle(){
        if(open){
            menu_animation.start({
                opacity:0,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                menu_animation.set({
                    display:"none",
                });
                setOpen(false);
            });
        }else{
            menu_animation.start({
                opacity:1,
                display:"flex",
                transition:{
                    duration:0.3
                }
            }).then(() => {
                setOpen(true);
            });
        }
    }
    
    function toggleChangeState(){
        if(change_state_open){
            states_animation.start({
                opacity:0,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                states_animation.set({ display:"none" })
                setChangeStateOpen(false);
            })
        }else{
            states_animation.start({
                display:"flex",
                opacity:1,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                setChangeStateOpen(true);
            })
        }
    }
    return(
        <div className={styles.orders_table_values}>
            <div className={styles.orders_user_wrapper}>
                <img className={styles.orders_user_image} alt="profile_image" src="https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg" />
                <div className={styles.orders_user_name}>{_order.user.username}</div>
            </div>
            <div className={styles.orders_table_value}>{_order._id}</div>
            <div className={styles.orders_table_value}>{(new Date(_order._createdAt)).toDateString()}</div>
            <div className={styles.orders_table_value}>{_order.state}
                <motion.div animate={states_animation} className={styles.states_wrapper}>
                    {
                        ["Processing","Shipped","Delivered","Cancelled"].map((value,i) => {
                            
                            function changeState(evt){
                                evt.preventDefault();
                                axios.post("/api/admin/change_state",{ order_id:_order._id,state:value },{
                                    headers:{
                                        "Content-Type":"application/json"
                                    }
                                }).then((response) => {
                                    console.log(response);
                                    if(response.data.status == "success"){
                                        setOrder(s => { return {...s,state:value }});
                                        states_animation.start({
                                            opacity:0,
                                            transition:{
                                                duration:0.3
                                            }
                                        }).then(() => {
                                            states_animation.set({ display:"none" })
                                            setChangeStateOpen(false);
                                            menu_animation.start({
                                                opacity:0,
                                                transition:{
                                                    duration:0.3
                                                }
                                            }).then(() => {
                                                menu_animation.set({
                                                    display:"none",
                                                });
                                                setOpen(false);
                                            });
                                        });
                                        
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }

                            return(
                                <div key={i} onClick={changeState} className={styles.states}>{value}</div>
                            )
                        })
                    }
                </motion.div>
            </div>
            <div className={styles.orders_table_value+" flex flex-row justify-between"}>{_order.payment_method}
                <div className={styles.orders_table_actions_btn_wrapper}>
                    <IoMdMore onClick={toggle} className={styles.orders_table_actions_btn} />
                    <motion.div animate={menu_animation} className={styles.orders_table_actions_wrapper}>
                        <div onClick={toggleChangeState} className={styles.orders_table_action}>change state</div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

const styles = {
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