import { AiFillDashboard } from "react-icons/ai";
import { FaSearch,FaPlus,FaImage,FaTimes } from "react-icons/fa";
import { motion,useAnimation } from "framer-motion";
import Slider from "./Slider";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import Link from "next/link";

export default function Products({ products,categories,category }){
    const p_template = {name:"",price:{ value:"",currency:"" },category:{ name:"" },images:[] };
    var [alertMessage,setAlertMessage] = useState("");
    var alertAnimation = useAnimation();
    var [dialog_state,setDialogState] = useState("New");
    var [selected_product,setSelectedProduct] = useState(p_template);
    var openMenuAnimation = useAnimation();
    var new_product_dialog_animation = useAnimation();
    var new_category_animation = useAnimation();
    var [new_category_dialog_open,setNewCDOpen] = useState(false);
    var [dialog_open,setDialogOpen] = useState(false);
    var [menu_open,setMenuOpen] = useState(false);
    var [is_loading,setIsLoading] = useState(false);
    var images_input = useRef();
    var [new_category,setNewCategory] = useState("");
    
    

    function createCategory(evt){
        setIsLoading(true);
        axios.post("/api/admin/new_category",{ name:new_category },{ headers: { "Content-Type": "application/json" } }).then((response) => {
            if(response.data.status == "success"){
                setIsLoading(false);
                setAlertMessage(response.data.message);
                alertAnimation.start({
                    display:"block",
                    opacity:1,
                    transition:{
                        delay:0.3
                    }
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }

    function createNewProduct(evt){
        setIsLoading(true);
        axios.post("/api/admin/new_product",selected_product,{ headers: { "Content-Type": "application/json" } }).then((response) => {
            if(response.data.status == "success"){
                setIsLoading(false);
                setAlertMessage(response.data.message);
                alertAnimation.start({
                    display:"block",
                    opacity:1,
                    transition:{
                        delay:0.3
                    }
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }

    function updateProduct(evt){
        setIsLoading(true);
        axios.post("/api/admin/update_product",selected_product,{ headers: { "Content-Type": "application/json" } }).then((response) => {
            if(response.data.status == "success"){
                setIsLoading(false);
                setAlertMessage(response.data.message);
                alertAnimation.start({
                    display:"block",
                    opacity:1,
                    transition:{
                        delay:0.3
                    }
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }

    function openMenu(){
        if(menu_open){
            openMenuAnimation.start({
                opacity:0,
                transition:{
                    duration:0.3
                }
            }).then(() => {
                openMenuAnimation.set({
                    display:"none"
                });
                setMenuOpen(false);
                console.log("menu closed!");
            })
        }else{
            openMenuAnimation.start({
                opacity:1,
                display:"flex",
                transition:{
                    duration:0.3
                }
            }).then(() => {
                setMenuOpen(true);
                console.log("menu opened!");
            })
        }
    }

    function createProduct(){
        setDialogState("New");
        setSelectedProduct(p_template);
        toggle_dialog();
    }

    function toggle_dialog(){
        if(dialog_open){
            new_product_dialog_animation.start({
                opacity:0,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                new_product_dialog_animation.set({
                    display:"none"
                });
                setDialogOpen(false);
            });
        }else{
            new_product_dialog_animation.start({
                display:"flex",
                opacity:1,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                setDialogOpen(true);
            });
        }
    }

    function toggleNewCategoryDialog(){
        if(new_category_dialog_open){
            new_category_animation.start({
                opacity:0,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                new_category_animation.set({
                    display:"none"
                });
                setNewCDOpen(false);
            });
        }else{
            new_category_animation.start({
                opacity:1,
                display:"flex",
                transition:{
                    delay:0.3
                }
            }).then(() => {
                setNewCDOpen(true);
            });
        }
    }

    function uploadImages(evt){
        var form = new FormData();
        for(var i=0;i<evt.target.files.length;i++){
            form.append("file_"+i,evt.target.files[i]);
        }

        axios.post("/api/admin/upload_product_images",form,{ headers: { "Content-Type": "multipart/form-data" } }).then((response) => {
            console.log("response:",response);
            if(response.data.status == "success"){
                setSelectedProduct(state => { 
                    return {
                        ...state,
                        images:[...state.images,...response.data.images]
                    }
                });
            }else{

            }
        });
    }

    function removeImage(index){
        setSelectedProduct(state => {
            return { ...state,images:state.images.slice(0,index).concat(state.images.slice(index+1,state.images.length)) }
        })
    }

    return(
        <div className={styles.container}>
            {
                (is_loading) ? ( 
                    <div className="flex flex-col items-center justify-center z-10 w-screen h-screen absolute top-0 left-0 bg-[#00000055]">
                        <Loading />
                    </div>
                 ) : ""
            }
            <div className={styles.header_wrapper} >
                <div className={styles.title} >Products</div>
                <AiFillDashboard className={styles.dashboard_icon} />
            </div>
            <div className={styles.products_container}>
                <div className={styles.products_header_wrapper}>
                    <div className={styles.products_header_search_wrapper}>
                        <FaSearch className={styles.products_header_search_icon}/>
                        <input className={styles.products_header_search_input} placeholder="search..." />
                    </div>
                    <div onClick={createProduct} className={styles.products_header_nav_new_product}><FaPlus className={styles.products_header_nav_new_product_icon} />New Product</div>
                    <div onClick={toggleNewCategoryDialog} className={styles.products_header_nav_new_category}><FaPlus className={styles.products_header_nav_new_category_icon} />Create New Category</div>

                    <div className={styles.products_header_nav_wrapper}>
                        <div className={styles.products_header_nav} onClick={openMenu}>categories</div>
                        <motion.div animate={openMenuAnimation} className={styles.categories_wrapper}>
                            {
                                categories.map((c,i) => {
                                    return(
                                        <Link key={i} href={"/admin/products/?category="+c.name}>
                                            <div className={styles.category}>{c.name}</div>
                                        </Link>
                                    )
                                })
                            }
                        </motion.div>
                    </div>
                </div>
                
                

                <div className={styles.products_category_wrapper}>
                    {
                        (category == "All") ?  (<Link href={"/admin/products/"}><div className={styles.products_category+" bg-[#252936]"}>All</div></Link>):(<Link href={"/admin/products/"}><div className={styles.products_category}>All</div></Link>)
                        
                    }
                    {
                        categories.map((c,i) => {
                            if(category == c.name){
                                return(
                                    <Link key={i} href={"/admin/products/?category="+c.name}>
                                        <div className={styles.products_category+" bg-[#252936]"}>{c.name}</div>
                                    </Link>
                                )
                            }else{
                                return(
                                    <Link key={i} href={"/admin/products/?category="+c.name}>
                                        <div className={styles.products_category}>{c.name}</div>
                                    </Link>
                                )
                            }
                        })
                        
                    }
                </div>
                <div className={styles.products_wrapper}>
                    {
                        products.map((p,i) => {
                            function editProduct(){
                                setDialogState("Edit");
                                setSelectedProduct(p);
                                toggle_dialog();
                            }

                            return(
                                <div key={i} onClick={editProduct} className={styles.product_container}>
                                    <div onClick={editProduct} className={styles.product_wrapper}>
                                        <div className={styles.product_image_wrapper}>
                                            <img className={styles.product_image} alt="product_image" src={p.images[0].url} />
                                        </div>
                                        <div className={styles.product_name}>{p.name}</div>
                                        <div className={styles.product_category}>{p.category.name}</div>
                                        <div className={styles.product_price}>${p.price.value}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
            <motion.div animate={new_product_dialog_animation} className="absolute shadow-xl hidden opacity-0 flex-col justify-center items-center left-0 top-0 h-screen w-screen bg-[#00000066]">
                <div className="w-3/5 h-5/6 flex flex-col items-center bg-[#252936] rounded-lg">
                    <div className="w-full flex flex-row items-center justify-end p-2">
                        <FaTimes onClick={toggle_dialog} className="cursor-pointer text-xl font-bold text-[#bdbdba]"/>
                    </div>
                    <div className="w-11/12 flex flex-row items-center">
                        <div className="text-lg font-bold text-[#bdbdba] py-2">{dialog_state} Product :</div>
                    </div>
                    <div className="w-11/12 flex flex-col items-center">
                        <Slider images={selected_product.images} removeImage={removeImage} />
                        <div onClick={() => images_input.current.click()} className="px-4 font-bold text-base text-[#ebebeb] cursor-pointer py-1 bg-blue-500 rounded-lg flex flex-row items-center">
                            <FaImage className="mx-1" />Upload Image
                            <input onChange={uploadImages} ref={images_input} type={"file"} multiple={true} hidden={true} />
                        </div>
                        <input className="w-11/12 px-4 py-2 rounded-lg my-2" placeholder="name..." onChange={(evt) => setSelectedProduct(state => { return { ...state,name: evt.target.value } })} value={selected_product.name}/>
                        <div className="w-11/12 flex flex-row items-center justify-between my-2">
                            <input className="w-3/4 px-4 py-2 rounded-lg my-2" placeholder="price..." onChange={(evt) => setSelectedProduct(state => { return { ...state,price:{ ...state.price,value:evt.target.value }}})} value={selected_product.price.value}/>
                            <select onChange={(evt) => setSelectedProduct(state => { return { ...state,price:{ ...state.price,currency:evt.target.value }}})} value={selected_product.price.currency} className="w-1/5 px-4 py-2 rounded-lg my-2">
                                <option className="px-4 py-2 rounded-lg my-2">USD</option>
                                <option className="px-4 py-2 rounded-lg my-2">EURO</option>
                                <option className="px-4 py-2 rounded-lg my-2">DZD</option>
                            </select>
                        </div>
                        <div className="w-11/12 flex flex-row items-center">
                            <div className="w-1/6 text-lg text-center font-semibold text-[#ebebea]">Category:</div>
                            <select className="w-4/5 px-4 py-2 rounded-lg my-2" onChange={(evt) => setSelectedProduct(state => { return { ...state,category:{ _id:evt.target.options[evt.target.selectedIndex].getAttribute("_id"),name:evt.target.value }}})} value={selected_product.category.name}>
                                <option className="px-4 py-2 rounded-lg my-2" _id={null}>Default</option>
                                {
                                    categories.map((c,i) => {
                                        return(
                                            <option key={i} className="px-4 py-2 rounded-lg my-2" _id={c._id}>{c.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div onClick={(dialog_state == "New" ? createNewProduct : updateProduct)} className="cursor-pointer text-lg font-bold text-[#ebebeb] bg-blue-500 px-4 py-1 rounded-lg my-2">{dialog_state == "New" ? "Create" : "Update"}</div>
                    </div>
                </div>
            </motion.div>
            <motion.div animate={new_category_animation} className={styles.new_categroy_dialog_container}>
                <div className={styles.new_category_wrapper}>
                    <div className={styles.new_category_header}>
                        <FaTimes onClick={toggleNewCategoryDialog} className={styles.new_category_header_close_icon} />
                    </div>
                    <div className={styles.new_category_body}>
                        <input className={styles.new_category_input} placeholder="name your category..." onChange={(evt) => { setNewCategory(evt.target.value); }} value={new_category}/>
                        <div onClick={createCategory} className={styles.new_category_add_btn} >Add</div>
                    </div>
                </div>
            </motion.div>
            <motion.div animate={alertAnimation} className="absolute hidden opacity-0 top-5 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                <span className="font-medium">Success alert!</span> {alertMessage}.
            </motion.div>
        </div>
    )
}

const styles = {
    container:"w-11/12 bg-[#252936] flex flex-col items-center overflow-auto",
    header_wrapper:"w-11/12 flex flex-row items-center justify-between mt-10",
    title:"font-medium text-[#cbcbcd]",
    dashboard_icon:"text-[#f5f5f5] text-xl",
    products_container:"w-11/12 flex flex-col items-center rounded-lg mt-5 bg-[#2c3040] my-4 py-4 min-h-sceen",
    products_header_wrapper:"w-11/12 flex flex-row items-center",
    products_header_nav_wrapper:"mx-4 relative",
    products_header_nav:"px-4 py-2 rounded-lg text-[#cccccc] font-semibold cursor-pointer mr-2",
    products_header_nav_new_product:"cursor-pointer text-base font-semibold text-green-500 px-4 py-2 flex flex-row items-center",
    products_header_nav_new_product_icon:"mx-1",
    products_header_nav_new_category:"cursor-pointer text-base font-semibold text-blue-500 px-4 py-2 flex flex-row items-center",
    products_header_nav_new_category_icon:"mx-1",
    products_header_search_wrapper:"flex felx-row items-center bg-[#252936] p-2 rounded-lg",
    products_header_search_icon:"text-lg mx-2 text-[#bdbdbd]",
    products_header_search_input:"bg-[#252936] text-base text-[#bdbdbd]",
    products_category_wrapper:"w-11/12 flex flex-row items-center",
    products_category:"text-[#bdbdbd] text-base font-semibold px-4 py-2 rounded-t-lg mt-2 cursor-pointer",
    products_wrapper:"w-11/12 bg-[#252936] rounded-b-lg rounded-r-lg p-5 flex flex-row flex-wrap",
    product_container:"w-1/5 flex flex-col items-center my-2",
    product_wrapper:"w-11/12 flex flex-col items-center bg-[#2c3040] shadow-xl rounded-lg cursor-pointer",
    product_image_wrapper:"w-full h-52 rounded-lg flex flex-col items-center bg-white",
    product_image:" h-full rounded-lg object-cover",
    product_name:"w-11/12 text-base font-semibold text-[#ebebeb] py-2",
    product_category:"w-11/12 text-sm font-semibold text-[#ababab] py-2",
    product_price:"w-11/12 text-base font-semibold text-[#ebebeb] py-2",
    categories_wrapper:"opacity-0 hidden absolute rounded-lg w-60 shadow-xl bg-[#252936] flex-col items-center",
    category:"px-4 py-2 cursor-pointer rounded-lg text-base font-semibold text-[#ededed] hover:text-[#aaaaaa]",
    new_categroy_dialog_container:"absolute shadow-xl hidden opacity-0 flex-col justify-center items-center left-0 top-0 h-screen w-screen bg-[#00000099]",
    new_category_wrapper:"w-1/2 flex flex-col items-center bg-[#252936] shadow-xl rounded-lg",
    new_category_header:"w-full px-3 py-2 flex flex-row items-center justify-end",
    new_category_header_close_icon:"text-[#bdbdba] text-lg cursor-pointer",
    new_category_body:"w-11/12 flex flex-col items-center p-5",
    new_category_input:"w-11/12 px-4 py-2 rounded-lg  font-semibold",
    new_category_add_btn:"cursor-pointer font-semibold px-4 py-2 rounded-lg text-[#ededed] bg-blue-500 my-4"
}