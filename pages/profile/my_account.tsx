import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { PROFILE_IMAGE_PLACEHOLDER } from "../../utilities/consts";
import { FaCamera } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import Loading from "../../components/Loading";
import ToastContext from "../../contexts/ToastContext";

export default function MyAccount() {
    const { user, profileImageRef, isLoading, getUserWithEmail, updateUser } = useUser();
    const [draftUser, setDratUser] = useState<User>(user);
    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const toastManager = useContext(ToastContext);

    useEffect(() => {
        getUserWithEmail();
    }, []);

    useEffect(() => {
        setDratUser(user);
    }, [user]);

    const newChange = (user?.username != draftUser?.username) ||
        (user?.email != draftUser?.email) ||
        (user?.profile_image?.url != draftUser?.profile_image?.url);


    const onSelectProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        profileImageRef.current = event.target.files[0];
        if (profileImageRef.current) {
            setDratUser(state => ({ ...state, profile_image: { url: URL.createObjectURL(profileImageRef.current) } }));
        }
    }

    const updateHandler = async () => {
        const result = await updateUser(draftUser);
        if (result.isError) {
            toastManager.alertError("Error", result.message);
            setDratUser(user);
        } else {
            toastManager.alertSuccess("Success", result.message);
        }
    }

    return (
        <div className="flex flex-col items-center w-full dark:bg-[#252936]">
            {
                isLoading && (
                    <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                        <Loading />
                    </div>
                )
            }
            <Header />
            <div className="w-11/12 flex">
                <SideBar selectedTab='my-account' />
                <div className="w-5/6 flex flex-col items-center">
                    <div className="w-2/3 flex flex-col py-16">
                        <div className="h-28 w-28 rounded-full bg-gray-200 relative select-none shadow shadow-black">
                            <input ref={profileImageInputRef} onChange={onSelectProfileImage} type="file" hidden />
                            <img src={draftUser?.profile_image?.url || PROFILE_IMAGE_PLACEHOLDER} className="w-full h-full rounded-full object-cover" />
                            <div onClick={() => profileImageInputRef.current.click()} className="h-8 w-8 flex flex-col items-center justify-center text-white bg-primary-color hover:bg-blue-600 rounded-full cursor-pointer active:scale-105 absolute bottom-0 right-0">
                                <FaCamera />
                            </div>
                        </div>
                        <div className="w-full my-16 flex flex-col">
                            <div className="flex items-center">
                                <div className="text-black w-28">Username:</div>
                                <input value={draftUser?.username} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setDratUser(state => ({ ...state, username: event.target.value })); }} placeholder="Enter a username" type="text" className="ml-4 w-96 bg-transparent border rounded-full px-6 py-2" />
                            </div>
                            <div className="flex items-center mt-10">
                                <div className="text-black w-28">Email:</div>
                                <input value={draftUser?.email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setDratUser(state => ({ ...state, email: event.target.value })); }} placeholder="Enter your email" type="text" className="ml-4 w-96 bg-transparent border rounded-full px-6 py-2" />
                            </div>
                        </div>
                        {
                            newChange && (
                                <div className="w-full flex items-center justify-end">
                                    <div onClick={() => { setDratUser(user); }} className="px-20 py-2 rounded-full border border-primary-color text-primary-color w-fit cursor-pointer duration-300 select-none active:scale-105 mr-2">Cancel</div>
                                    <div onClick={updateHandler} className="px-20 py-2 rounded-full border border-primary-color bg-primary-color hover:bg-blue-600 text-white w-fit cursor-pointer duration-300 select-none active:scale-105">Save</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}