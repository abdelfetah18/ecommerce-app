import AdminLayout from "../../components/admin/AdminLayout";
import { FaTimes } from "react-icons/fa";
import useCategories from "../../hooks/useCategories"
import useCreateCategory from "../../hooks/useCreateCategory";
import React, { useContext, useState } from "react";
import ToastContext from "../../contexts/ToastContext";
import Loading from "../../components/Loading";
import Model from "../../components/Model";
import useModel from "../../hooks/useModel";

export default function Categories() {
    const toastManager = useContext(ToastContext);
    const { categories, appendNewCategory, removeCategoryById } = useCategories();
    const { category, setCategory, createCategory, deleteCategory, isLoading } = useCreateCategory();
    const [selectedCategory, setSelectedCategory] = useState<Category>({ name: '' });
    const useModelValue = useModel();

    const createHandler = async (event: React.MouseEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();

        const result = await createCategory();
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", "Category Created Successfully");
            appendNewCategory(result.value);
            setCategory({ name: '' });
        }
    }

    const deleteHandler = async (event: React.MouseEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();

        const result = await deleteCategory(selectedCategory._id);
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", result.message);
            removeCategoryById(selectedCategory._id);
            setSelectedCategory({ name: '' });
        }

        useModelValue.close();
    }

    return (
        <AdminLayout page="categories">
            <div className={styles.container}>
                {
                    isLoading && (
                        <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                            <Loading />
                        </div>
                    )
                }
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Categories</div>
                </div>
                <div className="w-11/12 flex items-center mt-10">
                    <input value={category.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setCategory(state => ({ ...state, name: event.target.value })) }} placeholder="Enter a new category name" type="text" className="w-96 px-8 py-2 rounded-full bg-gray-100 placeholder:text-gray-300 focus:bg-gray-200 focus:placeholder:text-gray-400" />
                    <div onClick={createHandler} className="px-8 py-2 rounded-full bg-primary-color text-white font-bold cursor-pointer active:scale-110 duration-300 ml-2 select-none">Add</div>
                </div>
                <div className="w-11/12 flex flex-col mt-10 overflow-auto rounded-md py-2">
                    {
                        categories.map((category, index) => {
                            return (
                                <div key={index} className="flex items-center">
                                    <div className="text-black py-2 w-80">{category.name}</div>
                                    <div onClick={() => { setSelectedCategory(category); useModelValue.open(); }} className="text-black active:scale-125 duration-300 cursor-pointer select-none"><FaTimes /></div>
                                </div>
                            )
                        })
                    }
                </div>
                <Model useModel={useModelValue}>
                    <div className="bg-white border-2 rounded-lg flex flex-col items-center justify-center p-4">
                        <div className="whitespace-nowrap text-lg text-black px-4 mb-4">Do you really wanna delete <span className="text-red-500 font-medium">{selectedCategory.name}</span> category:</div>
                        <div className="flex items-center">
                            <div onClick={deleteHandler} className="border border-primary-color rounded-full px-8 py-2 bg-primary-color text-white cursor-pointer active:scale-105 duration-300 select-none">Yes</div>
                            <div onClick={() => useModelValue.close()} className="ml-2 border border-primary-color rounded-full px-8 py-2 text-primary-color cursor-pointer active:scale-105 duration-300 select-none">No</div>
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
}