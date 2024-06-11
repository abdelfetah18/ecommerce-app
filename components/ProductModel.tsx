import { FaTimes } from "react-icons/fa";
import { UseModelReturn } from "../hooks/useModel";
import Model from "./Model";
import Slider from "./Slider";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContext } from "react";
import ShoppingCartContext from "../contexts/ShoppingCartContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ProductsFavContext from "../contexts/ProductsFavContext";

interface ProductModelProps {
    useModelValue: UseModelReturn;
    product: Product;
};

export default function ProductModel({ useModelValue, product }: ProductModelProps) {
    const [productsIds, setProductsIds] = useContext(ProductsFavContext);
    const [shoppingCartItems, setShoppingCartItems] = useContext(ShoppingCartContext);

    const isInFav = productsIds.includes(product._id);
    const isInShoppingCart = shoppingCartItems.filter(p => p._id == product._id).length > 0;

    const toggleFavHandler = (event: React.MouseEvent) => {
        event.preventDefault();
        if (isInFav) {
            setProductsIds(productsIds.filter(id => id != product._id));
        } else {
            setProductsIds([...productsIds, product._id]);
        }
    }

    const toggleShoppingCart = (event: React.MouseEvent) => {
        event.preventDefault();
        if (isInShoppingCart) {
            setShoppingCartItems(shoppingCartItems.filter(p => p._id != product._id));
        } else {
            setShoppingCartItems([...shoppingCartItems, product]);
        }
    }

    return (
        <Model useModel={useModelValue}>
            <div className="w-1/2 min-w-[600px] flex flex-col items-center py-4 bg-white border-2 rounded-lg">
                <div className="w-11/12 flex flex-col">
                    <div className="w-full flex items-center justify-end py-2">
                        <div onClick={() => useModelValue.close()} className="text-xl text-black cursor-pointer active:scale-125 duration-300"><FaTimes /></div>
                    </div>
                    <Slider images={product.images} />
                    <div className="w-full text-black font-semibold capitalize mt-2">{product.name}</div>
                    <div className="text-sm text-gray-300">{product.category.name}</div>
                    <div className="w-full text-green-500 font-semibold">{product.price.value} {product.price.currency}</div>
                    <div className="w-full text-gray-500 text-xs">{product.sells} Sells</div>
                    <div className="w-full flex items-center flex-wrap mt-2">
                        <div onClick={toggleShoppingCart} className="px-4 py-2 mt-2 text-base rounded-full border border-black active:scale-105 duration-300 cursor-pointer select-none">{isInShoppingCart ? "Remove from Cart" : "Add to Cart"}</div>
                        <div onClick={toggleFavHandler} className={`ml-2 mt-2 h-10 aspect-square text-xl flex items-center justify-center border rounded-full active:scale-105 duration-300 cursor-pointer ${isInFav ? 'text-red-500 border-red-500' : 'text-black border-black'}`}>
                            {isInFav ? (<AiFillHeart />) : (<AiOutlineHeart />)}
                        </div>
                    </div>
                </div>
            </div>
        </Model>
    )
}