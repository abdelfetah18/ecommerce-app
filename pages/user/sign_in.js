import { useState } from "react";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import { FcGoogle } from "react-icons/fc";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";
import Link from "next/link";

export default function SignIn(){
    var [username,setUsername] = useState("");
    var [password,setPassword] = useState("");
    var [waiting,setWaiting] = useState(false);
    var [alertMessage,setAlertMessage] = useState("");
    var alertMessageAnimation = useAnimation();

    function sign_in(evt){
        setWaiting(true);
        axios.post("/api/user/sign_in",{ username,password },{
            Headers:{
                "Content-Type":"json/application"
            }
        }).then((response) => {
            setWaiting(false);
            if(response.data.status === "success"){
                setAlertMessage(response.data.message);
                alertMessageAnimation.start({
                    opacity:1,
                    display:"block",
                    borderColor:"#23ff23",
                    color:"#23ff23"
                }).then(() => {
                    window.location.href = "/";
                });
            }else{
                setAlertMessage(response.data.message);
                alertMessageAnimation.start({
                    opacity:1,
                    display:"block",
                    borderColor:"#ff2222",
                    color:"#ff2222"
                }).then(() => {

                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    return(
        <div className={styles.container}>
            {
                (waiting) ? ( 
                    <div className="flex flex-col items-center justify-center z-10 w-screen h-screen absolute top-0 left-0 bg-[#00000055]">
                        <Loading />
                    </div>
                 ) : ""
            }
            <div className="w-1/3 h-full shadow-[1px_0px_20px]">
                <div className="w-full h-full">
                    <img className="h-full w-full object-cover" src={"https://i.pinimg.com/736x/ac/01/a7/ac01a71a22bc48266f6cd10feddb5bb5.jpg"} />
                </div>
            </div>
            <div className="w-2/3 h-full flex flex-col items-center p-5">
                <div className={styles.welcom}>Welcom to my Shop</div>
                <div className={styles.form_wrapper}>
                    <div className={styles.form_header}>Sign in with:</div>
                    <div className={styles.google_wrapper}>
                        <FcGoogle />
                        <div className={styles.google_text}>Sign in</div>
                    </div>
                    <div className={styles.form_header}>or with:</div>
                    <div className={styles.form}>
                        <motion.div animate={alertMessageAnimation} className="border-l-2 opacity-0 bg-[#efefef] hidden rounded font-semibold text-base w-2/3 my-4 py-2 px-4">{alertMessage}</motion.div>
                        <Input type="text" value_state={[username,setUsername]} placeholder="username" />
                        <Input type="password" value_state={[password,setPassword]} placeholder="password" />
                    </div>
                    <div onClick={sign_in} className={styles.btn}>Sign in</div>
                    <Link href="/user/sign_up" ><div className={styles.s_btn}>Sign up</div></Link>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container:"w-screen h-screen flex flex-row items-center",
    welcom:"text-2xl font-bold px-4 py-4",
    form_wrapper:"border-2 w-5/6 h-2/3 rounded-xl flex flex-col items-center",
    form_header:"font-semibold text-lg px-4 py-2",
    form:"w-11/12 flex flex-col items-center py-4",
    btn:"w-1/3 text-center px-4 py-1 text-white font-semibold cursor-pointer hover:bg-red-500 bg-blue-500 rounded-lg my-1",
    s_btn:"w-1/3 text-center px-4 py-1 text-blue-500 font-bold cursor-pointer border-blue-500 border-2 rounded-lg my-1",
    google_wrapper:"my-2 cursor-pointer hover:bg-gray-300 flex flex-row items-center justify-center px-4 py-2 bg-gray-200 rounded-xl",
    google_text:"font-bold text-base ml-1"
}