import { motion, useAnimation } from "framer-motion";
import { FaSearch,FaChevronDown } from "react-icons/fa";

export default function DropDown({ header,items }){
    var dropDown = useAnimation();
    var open = false;
    
    function drop_me(){
        if(open){
            dropDown.start({
                height:"0px",
                opacity:0,
                transition:{
                    duration:0.5
                },
                scaleY:0
            }).then((v) => {
                dropDown.set({
                    display:"none"
                })
                open = false;
                console.log('close!',v);
            });
        }else{
            dropDown.start({
                display:"flex",
                opacity:1,
                height:(26*items.length)+"px",
                transition:{
                    duration:0.5
                },
                scaleY:1
            }).then((v) => {
                open = true;
                console.log('open!',v);
            });
        }
        
    }

    return(
        <div className={styles.div_wrapper}>
            <div className={styles.div_header} onClick={drop_me}>{header}<FaChevronDown /></div>
            <motion.div animate={dropDown} className={styles.div_body_wrapper}>
                {
                    items.map((item,i) => {
                        return(
                            <motion.div key={i} animate={dropDown} className={styles.div_body_item}>{item.name}</motion.div>
                        )
                    })
                }
            </motion.div>
        </div>
    )
}

const styles = {
    div_wrapper:"w-full flex flex-col items-center",
    div_header:"cursor-pointer text-base font-semibold w-full flex flex-row justify-between items-center px-2 py-1",
    div_body_wrapper:"hidden opacity-0 flex flex-col w-5/6 origin-top",
    div_body_item:"text-sm font-medium"
}