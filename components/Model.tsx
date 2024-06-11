import { AnimatePresence, Variants, motion } from "framer-motion";
import { UseModelReturn } from "../hooks/useModel";
import { ModelContext } from "../contexts/ModelContext";
import { FaTimes } from "react-icons/fa";

interface ModelProps {
    children: React.ReactNode;
    useModel: UseModelReturn;
    animationName?: AnimationName;
};

type AnimationName = 'CenterScaleFadeIn' | 'EdgeScaleFadeIn'

export default function Model({ children, useModel, animationName = 'CenterScaleFadeIn' }: ModelProps) {
    const { isOpen, close } = useModel;

    return (
        <ModelContext.Provider value={useModel}>
            <AnimatePresence>
                {
                    isOpen && (
                        <motion.div
                            variants={animations[animationName]}
                            initial="close"
                            animate="open"
                            exit="close"
                            className="w-full h-screen overflow-auto flex flex-col items-center absolute top-0 left-0 z-[98] backdrop-blur-sm"
                        >
                            <div className="w-11/12 flex-grow flex flex-col items-center justify-center">
                                {children}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </ModelContext.Provider>
    )
}

type AnimationNamesMap = {
    [key in AnimationName]: Variants;
};

const animations: AnimationNamesMap = {
    EdgeScaleFadeIn: {
        open: {
            opacity: 1,
            width: "100%",
            height: "100%",
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        close: {
            opacity: 0,
            width: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        }
    },
    CenterScaleFadeIn: {
        open: {
            opacity: 1,
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        close: {
            opacity: 0,
            width: "60%",
            height: "60%",
            left: "20%",
            top: "20%",
            transition: { duration: 0.3, ease: "easeOut" },
        }
    }
}