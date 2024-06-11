import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaEdit, FaShoppingBasket } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";

interface OrderActionsMenuProps {
    updateStateHandler: () => void;
    viewOrderHandler: () => void;
};

export default function OrderActionsMenu({ updateStateHandler, viewOrderHandler }: OrderActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(state => !state);
    }

    return (
        <div>
            <div className={styles.orders_table_actions_btn_wrapper}>
                <IoMdMore onClick={toggle} className={styles.orders_table_actions_btn} />
                <AnimatePresence>
                    {
                        isOpen && (
                            <motion.div
                                variants={{
                                    open: {
                                        opacity: 1,
                                        transition: { duration: 0.3 },
                                        marginTop: 0
                                    },
                                    close: {
                                        opacity: 0,
                                        transition: { duration: 0.3 },
                                        marginTop: -10
                                    },
                                }}
                                initial='close'
                                animate='open'
                                exit='close'
                                className={styles.orders_table_actions_wrapper}>
                                <div onClick={viewOrderHandler} className={styles.orders_table_action}><FaShoppingBasket className="mr-2" /> Open Order</div>
                                <div onClick={updateStateHandler} className={styles.orders_table_action}><FaEdit className="mr-2" /> Update State</div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

const styles = {
    orders_table_actions_btn_wrapper: "relative",
    orders_table_actions_btn: "text-lg cursor-pointer select-none active:scale-125 duration-300",
    orders_table_actions_wrapper: "absolute right-2 w-60 rounded-lg flex-col items-center bg-gray-100 select-none border shadow-xl z-50",
    orders_table_action: "w-full px-8 py-2 cursor-pointer flex items-center justify-center rounded-full active:scale-110 duration-300",
}