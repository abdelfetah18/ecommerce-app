import { useContext } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import Link from "next/link";
import useCreateAccount from "../../hooks/useCreateAccount";
import ToastContext from "../../contexts/ToastContext";
import { useRouter } from "next/router";

export default function SignUp() {
    const router = useRouter();
    const { isLoading, user, setUser, signUp } = useCreateAccount();
    const toastManager = useContext(ToastContext);

    async function signUpHandler() {
        const result = await signUp();
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", result.message);
            router.push("/user/sign_in");
        }
    }


    return (
        <div className="w-full h-screen flex flex-col items-center overflow-auto">
            {
                (isLoading) ? (
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
                            <input
                                value={user.username}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    event.preventDefault();
                                    setUser(state => ({ ...state, username: event.target.value }));
                                }}
                                className="w-96 border border-gray-400 px-4 py-2 rounded-full"
                                placeholder="Enter a username"
                                type="text"
                            />
                            <input
                                value={user.email}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    event.preventDefault();
                                    setUser(state => ({ ...state, email: event.target.value }));
                                }}
                                className="w-96 border border-gray-400 px-4 py-2 rounded-full mt-4"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <input
                                value={user.password}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter") {
                                        signUpHandler();
                                    }
                                }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    event.preventDefault();
                                    setUser(state => ({ ...state, password: event.target.value }));
                                }}
                                className="w-96 border border-gray-400 px-4 py-2 rounded-full mt-4"
                                placeholder="Enter a strong password"
                                type="password"
                            />
                        </div>
                        <div className="flex items-baseline text-sm mt-4">
                            <div className="text-black">{"Already have an account?"}</div>
                            <Link href="/user/sign_in" className="text-blue-600 ml-2 active:scale-110 duration-300 select-none cursor-pointer hover:text-blue-500 hover:font-semibold">Sign In</Link>
                        </div>

                        <button onClick={() => { signUpHandler(); }} className="w-96 bg-blue-600 rounded-full text-center select-none py-2 text-white mt-10 active:scale-110 duration-300 hover:bg-blue-500">Create an account</button>
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