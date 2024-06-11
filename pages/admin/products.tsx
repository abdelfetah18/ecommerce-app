import AdminLayout from "../../components/admin/AdminLayout";
import { FaEdit, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import useCategories from "../../hooks/useCategories";
import useProducts from "../../hooks/useProducts";
import { PLACEHOLDER_IMAGE } from "../../utilities/consts";
import Model from "../../components/Model";
import useModel from "../../hooks/useModel";
import Slider from "../../components/Slider";
import Link from "next/link";
import ToastContext from "../../contexts/ToastContext";

export default function Products() {
    const toastManager = useContext(ToastContext);
    const [selectedProduct, setSelectedProduct] = useState<Product>({ name: '', category: { name: '' }, images: [], price: { currency: 'USD', value: 0 } });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { products, isLoading, deleteProduct, removeProduct, isProcessing } = useProducts(selectedCategory);
    const { categories } = useCategories();

    const useModelValue = useModel();
    const useDeleteModel = useModel();

    const deleteHandler = async (event: React.MouseEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();

        const result = await deleteProduct(selectedProduct._id);
        if (result.isError) {
            toastManager.alertError('Error', result.message);
        } else {
            useDeleteModel.close();
            useModelValue.close();
            toastManager.alertSuccess('Success', 'Product Deleted Successfully');
            removeProduct(selectedProduct._id);
        }
    }

    return (
        <AdminLayout page="products">
            {
                isProcessing && (
                    <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                        <Loading />
                    </div>
                )
            }
            <div className={styles.container}>
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Products</div>
                </div>
                <div className={styles.products_container}>
                    <div className={styles.products_header_wrapper}>
                        <div className={styles.products_header_search_wrapper}>
                            <FaSearch className={styles.products_header_search_icon} />
                            <input className={styles.products_header_search_input} placeholder="search..." />
                        </div>
                    </div>
                    <div className={styles.products_category_wrapper}>
                        <div onClick={() => setSelectedCategory('all')}>
                            <div className={`${styles.products_category} ${selectedCategory == 'all' ? 'bg-primary-color text-white' : 'bg-gray-200 text-black'}`}>All</div>
                        </div>
                        {
                            categories.map((c, index) => {
                                const selected = c._id == selectedCategory;
                                const selectCategory = () => setSelectedCategory(c._id);

                                return (
                                    <div key={index} onClick={selectCategory}>
                                        <div className={`${styles.products_category} ${selected ? 'bg-primary-color text-white' : 'bg-gray-200 text-black'}`}>{c.name}</div>
                                    </div>
                                )
                            })

                        }
                    </div>
                    <div className={styles.products_wrapper}>
                        {
                            isLoading && (
                                <div className="w-full flex flex-col items-center my-16">
                                    <Loading />
                                </div>
                            )
                        }
                        {
                            !isLoading && products.map((p, i) => {

                                const selectProductHandler = (event: React.MouseEvent<HTMLDivElement>) => {
                                    setSelectedProduct(p);
                                    useModelValue.open();
                                }

                                return (
                                    <div key={i} className={styles.product_container}>
                                        <div onClick={selectProductHandler} className={styles.product_wrapper}>
                                            <div className={styles.product_image_wrapper}>
                                                <img className={styles.product_image} alt="product_image" src={p.images.length > 0 ? p.images[0].url : PLACEHOLDER_IMAGE} />
                                            </div>
                                            <div className={styles.product_name}>{p.name}</div>
                                            {
                                                selectedCategory == 'all' && (<div className={styles.product_category}>{p.category.name}</div>)
                                            }
                                            <div className={styles.product_price}>${p.price.value}</div>
                                            <div className={styles.product_sells}>{p.sells} Sells</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <Model useModel={useModelValue}>
                    <div className="w-1/2 min-w-[600px] flex flex-col items-center py-4 bg-white border-2 rounded-lg">
                        <div className="w-11/12 flex flex-col">
                            <div className="w-full flex items-center justify-end py-2">
                                <div onClick={() => useModelValue.close()} className="text-xl text-black cursor-pointer active:scale-125 duration-300"><FaTimes /></div>
                            </div>
                            <Slider images={selectedProduct.images} />
                            <div className="w-full text-black font-semibold capitalize mt-2">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-300">{selectedProduct.category.name}</div>
                            <div className="w-full text-green-500 font-semibold">{selectedProduct.price.value} {selectedProduct.price.currency}</div>
                            <div className="w-full text-gray-500 text-xs">{selectedProduct.sells} Sells</div>
                            <div className="w-full flex flex-col mt-8">
                                <Link href={`/admin/products/${selectedProduct._id}/update`} className="w-full py-2 bg-primary-color rounded-full text-white flex items-center justify-center duration-300 active:scale-110 select-none cursor-pointer">
                                    <FaEdit />
                                    <div className="ml-2">Update</div>
                                </Link>
                                <div onClick={() => { useDeleteModel.open(); }} className="w-full py-2 bg-red-500 rounded-full text-white flex items-center justify-center duration-300 active:scale-110 cursor-pointer select-none mt-2">
                                    <FaTrash />
                                    <div className="ml-2">Delete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Model>

                <Model useModel={useDeleteModel}>
                    <div className="bg-white border-2 rounded-lg flex flex-col items-center justify-center p-4">
                        <div className="whitespace-nowrap text-lg text-black px-4 mb-4">Do you really wanna delete <span className="text-red-500 font-medium">{selectedProduct.name}</span> product:</div>
                        <div className="flex items-center">
                            <div onClick={deleteHandler} className="border border-primary-color rounded-full px-8 py-2 bg-primary-color text-white cursor-pointer active:scale-105 duration-300 select-none">Yes</div>
                            <div onClick={() => useDeleteModel.close()} className="ml-2 border border-primary-color rounded-full px-8 py-2 text-primary-color cursor-pointer active:scale-105 duration-300 select-none">No</div>
                        </div>
                    </div>
                </Model>
            </div>
        </AdminLayout>
    )
}

const styles = {
    container: "w-5/6 bg-white flex flex-col items-center overflow-auto",
    header_wrapper: "w-11/12 flex flex-row items-center justify-between mt-10",
    title: "font-medium text-black text-lg",
    products_container: "w-11/12 flex flex-col items-center flex-grow my-6",
    products_header_wrapper: "w-full flex flex-col py-2",
    products_header_search_wrapper: "w-96 flex felx-row items-center bg-white px-4 py-2 rounded-full bg-gray-200 mb-2",
    products_header_search_icon: "text-lg mx-2 text-gray-300",
    products_header_search_input: "bg-transparent text-base placeholder:text-gray-300 text-black",
    products_category_wrapper: "w-full flex flex-row flex-wrap items-center mt-2",
    products_category: "text-sm font-semibold px-8 py-2 rounded-full mt-2 cursor-pointer hover:bg-primary-color hover:text-white duration-300 active:scale-110 whitespace-nowrap mr-2",
    products_wrapper: "w-full rounded-b-lg rounded-r-lg flex flex-row flex-wrap",
    product_container: "w-1/5 flex flex-col items-center my-4 pr-2",
    product_wrapper: "w-full h-full flex flex-col items-center cursor-pointer active:scale-105 duration-300",
    product_image_wrapper: "w-full aspect-square rounded-lg flex flex-col items-center bg-white",
    product_image: " h-full rounded-lg object-contain aspect-square",
    product_name: "w-11/12 text-base font-semibold text-black mt-2",
    product_category: "w-11/12 text-sm text-gray-300 mt-2",
    product_price: "w-11/12 text-green-500 mt-2",
    product_sells: "w-11/12 text-yellow-500 mb-4",
    categories_wrapper: "opacity-0 hidden absolute rounded-lg w-60 shadow-xl flex-col items-center bg-gray-100",
    category: "w-full py-2 cursor-pointer rounded-lg font-semibold text-black hover:text-primary-color hover:bg-gray-200",
}