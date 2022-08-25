import { useEffect, useRef, useState } from "react"
import { FaAngleRight,FaAngleLeft, FaTimes } from "react-icons/fa";

export default function Slider({ images,removeImage }){
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
        <>
            <div ref={slider} className="w-11/12 flex flex-row items-center overflow-hidden my-2">
                { 
                    images.map((img,index) => {
                        return(
                            <div key={index} className="relative min-w-full bg-[#2c3040] flex flex-col items-center rounded-lg">
                                <div onClick={() => removeImage(index)} className="absolute top-2 right-2 cursor-pointer">
                                    <FaTimes className="text-white text-xl" />
                                </div>
                                <img className="h-60 object-cover shadow-xl" alt="image" src={img.url} />
                            </div>
                        )
                    })
                }
            </div>
            <div className="relative bottom-1/4 w-11/12 flex flex-row items-center justify-between">
                <div onClick={prev} className="absolute left-0 cursor-pointer text-xl font-bold bg-[#00000055] px-4 py-2 text-[#bdbdba] rounded-lg">
                <FaAngleLeft />
                </div>
                <div onClick={next} className="absolute right-0 cursor-pointer text-xl font-bold bg-[#00000055] px-4 py-2 text-[#bdbdba] rounded-lg">
                    <FaAngleRight />
                </div>
            </div>
        </>
    )
}