import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function DropDown({ header, filter_type, items, useFilters }){
    const [selected, setSelected] = useState(null);
    let [filters, setFilters] = useFilters;
    let dropDown = useAnimation();
    let dropDownIcon = useAnimation();
    let open = false;

    useEffect(() => {
        setFilters(state => {
            let new_state = Object.assign({}, state);  // creating copy of state variable jasper
            new_state[filter_type] = selected;
            return new_state;
        });
    },[selected])
    
    function drop_me(){
        if(open){
            dropDownIcon.start({
                rotateX: "0deg",
                transition:{
                    duration:0.5
                },
            });
            dropDown.start({
                height:"0px",
                transition:{
                    duration:0.5
                },
                // scaleY:0
            }).then((v) => {
              
                open = false;
                console.log('close!',v);
            });
        }else{
            dropDownIcon.start({
                rotateX: "180deg",
                transition:{
                    duration:0.5
                },
            });
            dropDown.start({
                height: "fit-content",
                transition:{
                    duration:0.5
                },
                //scaleY:1
            }).then((v) => {
                open = true;
                console.log('open!',v);
            });
        }
        
    }

    return(
        <div className={styles.div_wrapper}>
            <div className={styles.div_header} onClick={drop_me}>
                {header}<motion.div animate={dropDownIcon}><FaChevronDown /></motion.div>
            </div>
            <motion.div animate={dropDown} className={[styles.div_body_wrapper + (selected ? "h-fit" : "")]}>
                {
                    items.map((item,i) => {
                        return <Item key={i} item={item} selected={selected} setSelected={setSelected} />
                    })
                }
            </motion.div>
        </div>
    )
}

const Item = ({ item, selected, setSelected }) => {
    function onClick(ev){
        setSelected(state => state == item ? null : item);
    }

    return <motion.div onClick={onClick} className={styles.div_body_item+(selected == item ? " dark:bg-[#363b50] bg-[#eee]" : "")}>{item.name || item}</motion.div>
}

const styles = {
    div_wrapper:"w-full flex flex-col items-center",
    div_header:"cursor-pointer text-base font-semibold w-full flex flex-row justify-between items-center py-1 dark:text-[#cbcbcd]",
    div_body_wrapper:"flex flex-col w-full origin-top overflow-hidden h-0",
    div_body_item:"text-sm font-normal dark:text-[#cbcbcd] px-4 py-2 cursor-pointer hover:bg-gray-800 rounded-md duration-300"
}