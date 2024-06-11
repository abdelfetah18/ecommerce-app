import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface SliderProps {
    images: { url: string }[]
};

export default function Slider({ images }: SliderProps) {
    let slider = useRef<HTMLDivElement>(null);
    let [currentImage, setCurrentImage] = useState(0);

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
        <div className="relative w-full flex flex-col items-center justify-center my-2 select-none">
            <div ref={slider} className="w-full max-h-72 bg-gray-100 dark:bg-[#252936] flex flex-row items-center overflow-hidden rounded-lg">
                {
                    images.map((img, index) => {
                        return (
                            <div key={index} className="min-w-full flex flex-col items-center">
                                <img className="h-72" alt="product_image" src={img.url} />
                            </div>
                        )
                    })
                }
            </div>
            {/* <div className="absolute w-full h-full flex flex-row items-center justify-between">
                <div onClick={prev} className="h-full flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-2 dark:border-[#252936] rounded-l-lg px-2 cursor-pointer">
                    <FaAngleLeft className="text-lg text-gray-400" />
                </div>
                <div onClick={next} className="h-full flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-2 dark:border-[#252936] rounded-r-lg px-2 cursor-pointer">
                    <FaAngleRight className="text-lg text-gray-400" />
                </div>
            </div> */}
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