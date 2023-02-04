import { useState } from "react";
import Loading from "../../components/Loading";
import { FcGoogle } from "react-icons/fc";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";

export default function SignUp(){
    var [username,setUsername] = useState("");
    var [email,setEmail] = useState("");
    var [password,setPassword] = useState("");
    var [waiting,setWaiting] = useState(false);
    var [alertMessage,setAlertMessage] = useState("");
    var alertMessageAnimation = useAnimation();

    async function sign_up(evt){
        setWaiting(true);
        try {
            var response = await axios.post("/api/user/sign_up",{ username,email,password },{
                Headers:{
                    "Content-Type":"json/application"
                }
            });
        } catch(err) {
            console.log(err);
        } finally {
            setWaiting(false);
            if(response.data.status === "success"){
                window.localStorage.setItem("access_token",response.data.access_token);
                setAlertMessage(response.data.message);
                alertMessageAnimation.start({
                    opacity:1,
                    display:"block",
                    borderColor:"#23dd23",
                    color:"#23dd23"
                }).then(() => {
                    window.location.href = "/user/sign_in";
                });
            }else{
                setAlertMessage(response.data.message);
                alertMessageAnimation.start({
                    opacity:1,
                    display:"block",
                    borderColor:"#ff3a3a",
                    color:"#ff3a3a"
                }).then(() => {

                });
            }
        }
    }
    

    return(
        <div className="w-full h-screen flex flex-row items-center">
            {
                (waiting) ? ( 
                    <div className="flex flex-col items-center justify-center z-10 w-screen h-screen absolute top-0 left-0 bg-[#00000077]">
                        <Loading />
                    </div>
                 ) : ""
            }
            <div className="w-2/3 h-full bg-white flex flex-col items-center">
                <div className="w-11/12">
                    <img className="w-20 h-20 rounded-full bg-white" src="/logo.png" />
                </div>
                <div className="w-11/12 flex-grow flex flex-col items-center justify-center">
                    <div className="text-black text-3xl font-bold">Register a New Account</div>
                    <div className="text-gray-500 text-base py-2">Register using social networks</div>
                    <div className="flex flex-row items-center">
                        <FcGoogle className="cursor-pointer text-3xl bg-gray-100 rounded-full"/>
                    </div>
                    <div className="text-base font-bold py-4">Or</div>
                    <motion.div animate={alertMessageAnimation} className="opacity-0 hidden text-base text-red-600">{alertMessage}</motion.div>
                    <div className="w-full flex flex-col items-center pb-4">
                        <input value={username} onChange={(evt) => { setUsername(evt.target.value); }} className="w-1/2 bg-gray-100 px-3 py-2 rounded-lg my-1" placeholder="Username" type="text" />
                        <input value={email} onChange={(evt) => { setEmail(evt.target.value); }} className="w-1/2 bg-gray-100 px-3 py-2 rounded-lg my-1" placeholder="Email" type="Email" />
                        <input value={password} onKeyDown={(evt) => { if(evt.key === "Enter"){ sign_up(evt); }}} onChange={(evt) => { setPassword(evt.target.value); }} className="w-1/2 bg-gray-100 px-3 py-2 rounded-lg my-1" placeholder="Password" type="password" />
                    </div>
                    <div onClick={sign_up} className="cursor-pointer px-6 py-2 rounded-lg bg-gray-900 text-white font-bold">Sign up</div>
                </div>
            </div>
            <div className="w-1/3 h-screen flex flex-col items-center justify-center bg-gray-900">
                <div className="text-white text-3xl text-base font-bold" >Already have an account ?</div>
                <div className="text-white text-xl w-2/3 text-center my-4">
                    {"Sign in and discover a great amount of new opportunities!"}
                </div>
                <a href="./sign_in" className="cursor-pointer px-6 py-2 rounded-lg bg-white text-black font-bold">Sign in</a>
            </div>
        </div>
    )
}