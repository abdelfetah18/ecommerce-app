import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ShoppingCartContext from "../contexts/ShoppingCartContext";
import { useContext } from "react";
import { PLACEHOLDER_IMAGE } from "../utilities/consts";
import ProductsFavContext from "../contexts/ProductsFavContext";

interface ProductProps {
    product: Product;
    onClick: () => void;
};

export default function Product({ product, onClick }: ProductProps) {
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
        <div className="w-full h-full flex flex-col items-center">
            <div onClick={onClick}  className="w-full flex flex-col items-center active:scale-105 duration-300 cursor-pointer">
                <div className="w-full flex flex-col items-center justify-center aspect-square bg-gray-200 rounded-lg select-none">
                    <img src={product.images.length > 0 ? product.images[0].url : PLACEHOLDER_IMAGE} className="w-full aspect-square object-contain" />
                </div>
                <div className="w-full text-black font-semibold capitalize mt-2">{product.name}</div>
                <div className="w-full text-green-500 font-semibold">{product.price.value} {product.price.currency}</div>
                <div className="w-full text-gray-500 text-xs">{product.sells} Sells</div>
            </div>
            <div className="w-full flex items-center flex-wrap mt-2">
                <div onClick={toggleShoppingCart} className="px-4 py-2 mt-2 text-base rounded-full border border-black active:scale-105 duration-300 cursor-pointer select-none">{isInShoppingCart ? "Remove from Cart" : "Add to Cart"}</div>
                <div onClick={toggleFavHandler} className={`ml-2 mt-2 h-10 aspect-square text-xl flex items-center justify-center border rounded-full active:scale-105 duration-300 cursor-pointer ${isInFav ? 'text-red-500 border-red-500' : 'text-black border-black'}`}>
                    {isInFav ? (<AiFillHeart />) : (<AiOutlineHeart />)}
                </div>
            </div>
        </div>
    )
}