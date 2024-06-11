import Header from "../components/Header";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { FaSearch } from "react-icons/fa";
import useCategories from "../hooks/useCategories";
import useSearchProducts from "../hooks/useSearchProducts";
import { useRouter } from "next/router";
import Product from "../components/Product";
import ProductModel from "../components/ProductModel";
import useModel from "../hooks/useModel";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState<string>((router.query.query as string | undefined) || '');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [orderBy, setOrderBy] = useState('');
    const { products, isLoading, search } = useSearchProducts();
    const { categories } = useCategories();
    const [selectedProduct, setSelectedProduct] = useState<Product>({ name: '', category: { name: '' }, images: [], price: { currency: 'USD', value: 0 } });
    const useModelValue = useModel();
  
    const getSelectedCategory = selectedCategory != 'all' ? selectedCategory : '';

    useEffect(() => {
        search(query, { category: getSelectedCategory, order_by: orderBy });
    }, [router.query]);

    return (
        <div className="w-full flex flex-col items-center overflow-auto bg-slate-50 dark:bg-[#252936]">
            <Header />
            <div className="w-11/12 flex flex-col mt-16">
                <form onSubmit={(ev) => { ev.preventDefault(); search(query, { category: getSelectedCategory, order_by: orderBy }); }} className="w-2/3 flex items-center rounded-full bg-gray-200">
                    <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Search for items, categories..." className="bg-transparent flex-grow px-6 py-3 placeholder:text-gray-400 text-black" />
                    <div className="px-6 text-gray-400">
                        <FaSearch />
                    </div>
                </form>
                <div className="text-gray-500 text-xs px-4 py-2">Press Enter to initiate search</div>

                <div className="w-full flex items-center flex-wrap mt-10">
                    <div className="flex items-center">
                        <div className="text-black">Category:</div>
                        <select onChange={(ev) => setSelectedCategory(ev.target.value)} className="px-6 py-2 bg-gray-200 rounded-full ml-2 outline-none border-r-8 capitalize">
                            <option value={"all"}>All</option>
                            {
                                categories.map((category, index) => {
                                    return (
                                        <option key={index} value={category.name} className="capitalize">{category.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="flex items-center ml-16">
                        <div className="text-black">Order By:</div>
                        <div onClick={() => setOrderBy('price')} className="flex items-center ml-4 cursor-pointer duration-300 active:scale-105">
                            <input checked={orderBy == 'price'} type="radio" />
                            <div className="ml-2">Price</div>
                        </div>
                        <div onClick={() => setOrderBy('name')} className="flex items-center ml-4 cursor-pointer duration-300 active:scale-105">
                            <input checked={orderBy == 'name'} type="radio" />
                            <div className="ml-2">Name</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center flex-wrap mt-8 min-h-[386px]">
                    {
                        (isLoading && products.length == 0) && (
                            <div className="w-full flex items-center justify-center">
                                <Loading />
                            </div>
                        )
                    }
                    {
                        (!isLoading && products.length == 0) && (
                            <div className="w-full text-center self-start text-black text-sm">No Products found.</div>
                        )
                    }
                    {
                        products.map((product, index) => {
                            const onClick = (): void => {
                                setSelectedProduct(product);
                                useModelValue.open();
                            }

                            return (
                                <div key={index} className="w-1/6 h-full px-2 pb-10">
                                    <Product product={product} onClick={onClick} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <ProductModel useModelValue={useModelValue} product={selectedProduct} />
        </div >
    )
}