import { motion,useAnimation } from "framer-motion";

export default function Input({ value_state,placeholder,type }){
    let label_animation = useAnimation();
    let [value,setValue] = value_state;

    function onFocus(evt){
        label_animation.start({
            fontSize: "0.75rem",
            color: "#00000055",
            top:"-0.5rem",
            backgroundColor:"#ffffff",
            left:"0.8rem",
            padding:"0 0.5rem"
        }).then(() => console.log('animation finished!'));
    }

    function onBlur(evt){
        if(value.length === 0){
            label_animation.start({
                fontSize: "1rem",
                color: "#00000055",
                top:"0.5rem",
                left: "1rem",
            }).then(() => console.log('animation finished!'));
        }
    }

    return(
        <div className="w-2/3 relative h-14">                            
            <input type={type} className="absolute bg-white border-2 rounded-lg w-full px-4 py-2 text-base" onChange={(evt) => setValue(evt.target.value)} value={value} onFocus={onFocus} onBlur={onBlur} />
            <motion.div onClick={onFocus} animate={label_animation} className="absolute top-2 left-4 text-[#999999] text-base">{placeholder}</motion.div>
        </div>
    )
}