import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { PROFILE_IMAGE_PLACEHOLDER } from "../utilities/consts";

export default function Settings({ user, settings_open }) {
    let settingsAnimation = useAnimation();

    useEffect(() => {
        toggleSettings();
    }, [settings_open]);

    function toggleSettings() {
        if (settings_open) {
            settingsAnimation.start({
                opacity: 0,
                transition: {
                    duration: 0.3
                }
            }).then(() => {
                settingsAnimation.set({ display: "none" });
            });
        } else {
            settingsAnimation.start({
                opacity: 1,
                display: "flex",
                transition: {
                    duration: 0.3
                }
            });
        }
    }

    return (
        <motion.div animate={settingsAnimation} className="absolute right-8 top-8 hidden opacity-0 flex-col items-center py-2 w-60 bg-gray-100 dark:bg-[#2c3040] rounded-lg dark:border-2 dark:border-[#252936] shadow-xl">
            <Link href={"/my_profile/my_orders"}>
                <div className="flex flex-row my-1 w-11/12 items-center ease-linear duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2">
                    <div className="w-10 flex flex-col items-center">
                        <img className="h-10 w-10 rounded-full bg-white" src={user.profile_image?.url || PROFILE_IMAGE_PLACEHOLDER} />
                    </div>
                    <div className="w-5/6 flex flex-col items-center">
                        <div className="text-sm font-medium w-11/12 dark:text-[#cbcbcd]">{user.username}</div>
                        <div className="text-xs text-gray-400 w-5/6">view profile</div>
                    </div>
                </div>
            </Link>
            <Link href={"/user/sign_out"}><div className="mt-4 w-11/12 text-center font-semibold py-1 cursor-pointer ease-linear duration-300 bg-gray-200 dark:bg-[#252936] dark:text-[#cbcbcd] rounded-lg hover:bg-gray-300">sign out</div></Link>
        </motion.div>
    );
}