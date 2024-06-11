import { FaImage } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import useCategories from "../../hooks/useCategories";
import useCreateProduct from "../../hooks/useCreateProdcut";
import ProductPreview from "../../components/admin/ProductPreview";
import { useContext, useRef } from "react";
import ToastContext from "../../contexts/ToastContext";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import SelectImagesSlider from "../../components/admin/SelectImagesSlider";

export default function CreateProduct() {
    const router = useRouter();
    const toastManager = useContext(ToastContext);
    const imagesInputRef = useRef<HTMLInputElement>(null);
    const { product, setProduct, createProduct, isLoading, productImages } = useCreateProduct();
    const { categories } = useCategories();

    const validateInputs = (): boolean => {
        if (product.name.length == 0) {
            toastManager.alertError('Name Input is required', 'Please enter a name of your product.');
            return false;
        }

        if (!product.category._id) {
            toastManager.alertError('Category is Required.', 'Please Select your product category.');
            return false;
        }

        if (product.price.value == 0) {
            toastManager.alertError("Error: Price cannot be zero.", "Please input a valid numerical value greater than zero.");
            return false;
        }

        return true;
    }

    const createProductHandler = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const result = await createProduct();
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", "Product Created Successfully");
            router.push('/admin/products');
        }
    }

    const onImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let images: Asset[] = [];

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files.item(i);
            productImages.current.push(file);
            images.push({ url: URL.createObjectURL(file) });
        }

        setProduct(state => ({ ...state, images: [...state.images, ...images] }));
    }

    const removeHandler = (index: number) => {
        setProduct(state => ({ ...state, images: [...state.images.filter((_, imageIndex) => imageIndex != index)] }));
        productImages.current = productImages.current.filter((_, fileIndex) => fileIndex != index);
    }

    const setAsThumb = (index: number) => {
        setProduct(state => {
            const newState = { ...state };
            let images = [newState.images[index]];
            newState.images.forEach((img, imgIndex) => {
                if (imgIndex != index) {
                    images.push(img);
                }
            });

            return { ...newState, images };
        });


        let files = [productImages.current[index]];
        productImages.current.forEach((file, fileIndex) => {
            if (fileIndex != index) {
                files.push(file);
            }
        });

        productImages.current = files;
    }

    return (
        <AdminLayout page="create_product">
            <div className={styles.container}>
                {
                    isLoading && (
                        <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                            <Loading />
                        </div>
                    )
                }
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Create Product</div>
                </div>
                <div className="w-full flex flex-col items-center my-16">
                    <div className="w-11/12 flex flex-row">
                        <div className="w-1/2">
                            <div className="w-full mb-8">
                                <div className="text-black text-lg font-medium">Name:</div>
                                <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setProduct(p => ({ ...p, name: event.target.value }))} placeholder="Enter your porduct name..." className="bg-gray-100 text-black placeholder:text-gray-400 rounded-full w-full px-8 py-2 mt-2" type="text" />
                            </div>
                            <div className="w-full mb-8">
                                <div className="text-black text-lg font-medium">Price:</div>
                                <div className="flex items-center mt-2">
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setProduct(p => ({ ...p, price: { value: parseFloat(event.target.value), currency: p.price.currency } }))} placeholder="Enter your product price" className="bg-gray-100 text-black placeholder:text-gray-400 rounded-full flex-grow px-8 py-2" type="number" />
                                    <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setProduct(p => ({ ...p, price: { value: p.price.value, currency: event.target.value } }))} className="bg-gray-100 text-black placeholder:text-gray-400 rounded-full w-fit px-8 py-2 ml-2 outline-none border-r-8 border-gray-100 cursor-pointer">
                                        <option value="Select Currency" disabled selected>Select Currency</option>
                                        <option>USD</option>
                                        <option>EURO</option>
                                        <option>DZD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full mb-8">
                                <div className="text-black text-lg font-medium">Category:</div>
                                <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setProduct(p => ({ ...p, category: { _id: event.target.value, name: event.target.value } }))} className="bg-gray-100 text-black placeholder:text-gray-400 rounded-full w-full px-8 py-2 outline-none border-r-8 border-gray-100 cursor-pointer mt-2">
                                    <option value="Select Category" disabled selected>Select Category</option>
                                    {
                                        categories.map((category, index) => {
                                            return (
                                                <option key={index} value={category._id} >{category.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="w-full mb-8">
                                <div className="text-black text-lg font-medium">Images:</div>
                                <input ref={imagesInputRef} onChange={onImageInputChange} type="file" accept="images/*" hidden />
                                {
                                    product.images.length > 0 ? (
                                        <div className="w-full">
                                            <SelectImagesSlider images={product.images} removeHandler={removeHandler} setAsThumb={setAsThumb} />
                                            <button className="bg-green-500 hover:bg-green-600 rounded-full text-white px-16 py-2 flex items-center justify-center cursor-pointer active:scale-105 duration-300">
                                                <FaImage />
                                                <div onClick={() => imagesInputRef.current.click()} className="ml-2">Add New Image</div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div onClick={() => imagesInputRef.current.click()} className="w-full h-40 border-2 rounded-xl border-dashed mt-2 flex items-center justify-center text-sm text-gray-500 select-none active:scale-105 duration-300 cursor-pointer">
                                            <FaImage />
                                            <div className="ml-2">Click to Select Images</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="w-full my-16">
                                <button onClick={createProductHandler} className="w-full bg-primary-color hover:bg-blue-600 rounded-full py-2 text-white duration-300 active:scale-105">Create</button>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col items-end">
                            <div className="w-2/3">
                                <ProductPreview product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}


const styles = {
    container: "w-5/6 bg-white flex flex-col items-center overflow-auto",
    header_wrapper: "w-11/12 flex flex-row items-center justify-between mt-10",
    title: "font-medium text-lg text-black"
};