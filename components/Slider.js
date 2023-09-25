import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Slider({ images }){
    var slider = useRef();
    var [slider_pos,setSliderPos] = useState(0);

    useEffect(() => {
        slider.current.scrollTo({
            left:slider_pos,
            behavior:"smooth"
        });
    },[slider_pos]);

    function next(){
        if(slider_pos < slider.current.scrollWidth-(images.length)){
            setSliderPos((state) => state+=slider.current.offsetWidth);
        } 
    }

    function prev(){
        if(slider_pos > 0){
            setSliderPos((state) => state-=slider.current.offsetWidth);
        } 
        
    }

    return(
        <div className="relative w-11/12 flex flex-col items-center justify-center my-2">
            <div ref={slider} className="w-full max-h-72 bg-gray-100 dark:bg-[#252936] flex flex-row items-center overflow-hidden rounded-lg">
                {
                    images.map((img,index) => {
                        return(
                            <div key={index} className="min-w-full flex flex-col items-center">
                                <img className="h-72" alt="product_image" src={img.url} />
                            </div>
                        )
                    })
                }
            </div>
            <div className="absolute w-full h-full flex flex-row items-center justify-between">
                <div onClick={prev} className="h-full flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-2 dark:border-[#252936] rounded-l-lg px-2 cursor-pointer">
                    <FaAngleLeft className="text-lg text-gray-400"/>
                </div>
                <div onClick={next} className="h-full flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-2 dark:border-[#252936] rounded-r-lg px-2 cursor-pointer">
                    <FaAngleRight className="text-lg text-gray-400"/>
                </div>
            </div>
        </div>
    )
}