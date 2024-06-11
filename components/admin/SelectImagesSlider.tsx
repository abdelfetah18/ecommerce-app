import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import { FcRemoveImage } from "react-icons/fc";
import { AiFillFileImage } from "react-icons/ai";

interface SelectImagesSliderProps {
    images: Asset[];
    removeHandler: (index: number) => void;
    setAsThumb: (index: number) => void;
};

export default function SelectImagesSlider({ images, removeHandler, setAsThumb }: SelectImagesSliderProps) {
    let slider = useRef<HTMLDivElement>(null);
    let [currentImage, setCurrentImage] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        slider.current.scrollTo({
            left: currentImage * slider.current.offsetWidth,
            behavior: "smooth"
        });
    }, [currentImage]);

    function next() {
        setCurrentImage(state => {
            if (state < (images.length - 1)) {
                return state + 1;
            }
            return state;
        });
    }

    function prev() {
        setCurrentImage(state => {
            if (state > 0) {
                return state - 1;
            }
            return state;
        });

    }

    return (
        <div className="w-full flex flex-col items-center justify-center my-2 select-none relative">
            <div ref={slider} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="w-full max-h-72 bg-gray-100 flex flex-row items-center overflow-hidden rounded-lg">
                {
                    images.map((img, index) => {
                        return (
                            <div key={index} className="min-w-full flex flex-col items-center">

                                <img className="h-72" alt="product_image" src={img.url} />
                            </div>
                        )
                    })
                }
                <AnimatePresence>
                    {
                        show && (
                            <motion.div
                                variants={{
                                    open: { opacity: 1 },
                                    close: { opacity: 0 },
                                }}
                                initial='close'
                                animate='open'
                                exit='close'
                                className="absolute top-2 right-2">
                                <div onClick={() => { removeHandler(currentImage); setCurrentImage(state => state > 0 ? state - 1 : 0); }} className="flex items-center justify-center text-black text-sm bg-white rounded-full py-2 px-8 cursor-pointer active:scale-105 duration-300">
                                    <FcRemoveImage />
                                    <div className="ml-2">Remove</div>
                                </div>
                                {
                                    currentImage != 0 && (
                                        <div onClick={() => { setAsThumb(currentImage); setCurrentImage(0); }} className="flex items-center justify-center text-black text-sm bg-white rounded-full py-2 px-8 cursor-pointer active:scale-105 duration-300 mt-2">
                                            <AiFillFileImage />
                                            <div className="ml-2">Set As Thumb</div>
                                        </div>
                                    )
                                }
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
            <div className="w-full flex items-center justify-between py-2">
                <div className="px-4 flex items-center">
                    {
                        images.map((_, index) => {
                            const selected = index == currentImage;

                            return (
                                <div key={index} className={`h-4 rounded-full mr-2 duration-300 ${selected ? 'bg-primary-color w-8' : 'bg-gray-200 w-4'}`}></div>
                            )
                        })
                    }
                </div>
                <div className="flex items-center">
                    <div onClick={prev} className="bg-primary-color hover:bg-blue-600 rounded-full px-2 py-2 active:scale-110 duration-300 cursor-pointer">
                        <FaAngleLeft className="text-lg text-white" />
                    </div>
                    <div onClick={next} className="bg-primary-color hover:bg-blue-600 rounded-full px-2 py-2 active:scale-110 duration-300 cursor-pointer mx-2">
                        <FaAngleRight className="text-lg text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}