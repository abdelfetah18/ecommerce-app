import React, { useContext } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import ToastContext from "../contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { IconType } from "react-icons";

export default function Toast() {
    const { messages } = useContext(ToastContext);

    return (
        <div className='absolute top-0 left-0 w-full flex flex-col items-center justify-center z-[999]'>
            <AnimatePresence>
                {
                    messages.map((message, index) => {
                        return <Alert message={message} key={index} />
                    })
                }
            </AnimatePresence>
        </div>
    )
}


interface AlertProps {
    message: ToastMessage;
};

function Alert({ message }: AlertProps) {
    const Icon = icons[message.type];

    return (
        <motion.div
            variants={{
                open: {
                    opacity: 1,
                    marginTop: 40,
                    marginBottom: 40,
                    transition: { duration: 0.3, ease: "easeInOut" }
                },
                init: {
                    opacity: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    transition: { duration: 0.3, ease: "easeInOut" }

                },
                close: {
                    opacity: 0,
                    marginTop: 80,
                    marginBottom: 0,
                    transition: { duration: 0.3, ease: "easeInOut" }
                }
            }}
            initial='init'
            animate='open'
            exit='close'
            className={alertStyles[message.type]} role="alert">
            <Icon />
            <div className="ml-2">
                <span className="font-medium">{message.title}</span> {message.message}
            </div>
        </motion.div>
    )
}

type AlertStyles = {
    [type in ToastMessageType]: string;
}

const alertStyles: AlertStyles = {
    success: 'w-1/2 flex items-center p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 shadow-xl',
    info: 'w-1/2 flex items-center p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 shadow-xl',
    error: 'w-1/2 flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-xl',
};

const icons: Icons = {
    error: FaExclamationTriangle,
    info: FaInfoCircle,
    success: FaCheckCircle
};

type Icons = {
    [type in ToastMessageType]: IconType;
}