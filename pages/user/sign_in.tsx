import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import React from "react";
import Link from "next/link";
import ToastContext from "../../contexts/ToastContext";
import useAuth from "../../hooks/useAuth";
import UserSessionContext from "../../contexts/UserSessionContext";
import { useRouter } from "next/router";

export default function SignIn() {
    const router = useRouter();
    const auth = useAuth();
    const toastManager = useContext(ToastContext);
    const { updateUserSession } = useContext(UserSessionContext);

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    const signInHandler = async (event: React.MouseEvent | React.KeyboardEvent) => {
        event.preventDefault();
        let response = await auth.signIn({ username, password });
        if (response.isError) {
            toastManager.alertError("Error", response.message);
        } else {
            updateUserSession(response.value);
            router.push('/');
        }
    }

    return (
        <div className="w-full h-screen flex flex-col items-center overflow-auto">
            {
                (auth.isLoading) ? (
                    <div className="flex flex-col items-center justify-center z-10 w-screen h-screen absolute top-0 left-0 bg-[#00000077]">
                        <Loading />
                    </div>
                ) : ""
            }

            <div className="w-11/12 flex-grow flex flex-row items-center">
                <div className="w-1/2">
                    <img src="/images/left_side.jpg" />
                </div>
                <div className="w-1/2 flex flex-col items-center">
                    <div className="w-11/12 flex flex-col">
                        <div className="text-black font-medium whitespace-pre-line text-3xl">{"Welcome to\nShopName"}</div>
                        <div className="text-xs text-gray-400 whitespace-pre-line my-8">{"Please fill details below*"}</div>
                        <div className="w-full flex flex-col">
                            <input value={username} onChange={(evt) => { setUsername(evt.target.value); }} className="w-96 border border-gray-400 px-4 py-2 rounded-full" placeholder="Enter your username" type="text" />
                            <input value={password} onKeyDown={(evt) => { if (evt.key === "Enter") { signInHandler(evt); } }} onChange={(evt) => { setPassword(evt.target.value); }} className="w-96 border border-gray-400 px-4 py-2 rounded-full mt-4" placeholder="Enter your password" type="password" />
                        </div>
                        <div className="flex items-baseline text-sm mt-4">
                            <div className="text-black">{"Don't have an account?"}</div>
                            <Link href="/user/sign_up" className="text-primary-color ml-2 active:scale-110 duration-300 select-none cursor-pointer hover:text-blue-500 hover:font-semibold">Sign Up</Link>
                        </div>

                        <button onClick={signInHandler} className="w-96 bg-primary-color rounded-full text-center select-none py-2 text-white mt-10 active:scale-110 duration-300 hover:bg-blue-500">Sign In to my account</button>
                    </div>
                </div>
            </div>
            <div className="w-11/12 flex items-center py-2">
                <div className="text-black text-xs">{"Copyright © 2024 Abdelfetah Dev. All rights reserved."}</div>
                <div className="flex items-center divide-solid ml-16">
                    <a href="#" className="mr-4 text-black text-xs hover:text-blue-600 duration-300 active:scale-105">{"Privacy Policy"}</a>
                    <a href="#" className="mr-4 text-black text-xs hover:text-blue-600 duration-300 active:scale-105">{"Terms of Use"}</a>
                </div>
            </div>
        </div>
    )
}