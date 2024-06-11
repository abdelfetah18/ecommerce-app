import { useState } from "react";
import ProductDialogue from "./ProductDialogue";
import { PLACEHOLDER_IMAGE } from "../utilities/consts";

export default function Products({ products, isPreview }) {
    const [selected_product, setSelectedProduct] = useState({ name: "", category: { name: "" }, price: { value: "" }, images: [] });
    const [product_dialog_open, setDialogueOpen] = useState(false);

    return (
        <div className={styles.products_wrapper}>
            {
                products.map((p, i) => {
                    function selectProduct(evt) {
                        setSelectedProduct(p);
                        setDialogueOpen(true);
                    }

                    return (
                        <div key={i} className={styles.product_container}>
                            <div onClick={selectProduct} className={styles.product_wrapper}>
                                <div className={styles.image_wrapper}>
                                    <img className={styles.image} src={p.images.length > 0 ? p.images[0].url : PLACEHOLDER_IMAGE} />
                                </div>
                                <div className={styles.name}>{p.name}</div>
                                <div className={styles.p_category}>{p.category.name}</div>
                                <div className={styles.price}>${p.price.value}</div>
                            </div>
                        </div>
                    )
                })
            }
            <ProductDialogue isPreview={isPreview} product={selected_product} product_dialog_open={product_dialog_open} setDialogueOpen={setDialogueOpen} />
        </div>
    );
}

const styles = {
    products_wrapper: "w-full flex flex-row flex-wrap",
    product_container: "flex flex-col w-1/4 my-4 items-center ",
    product_wrapper: "rounded-md dark:bg-gray-700 flex flex-col w-11/12 items-center cursor-pointer hover:px-1  transition-linear duration-300 hover:shadow-xl",
    image_wrapper: "w-full rounded-t bg-gray-200 flex flex-col items-center",
    image: "h-52 object-contain rounded",
    name: "w-full font-medium text-lg w-11/12 pt-4 pb-1 dark:text-[#cbcbcd]",
    p_category: "w-full capitalize text-gray-400 text-xs w-11/12 py-1 dark:text-[#cbcbcd99]",
    price: "w-full text-green-600 text-sm pt-1 pb-4 w-11/12  dark:font-bold"
};