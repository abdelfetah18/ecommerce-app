import Navigation from "../../components/admin/Navigation";
import Products from "../../components/admin/Products";
import { getCategories, getProducts, getProductsByCategory } from "../../database/client";

export async function getServerSideProps({ req, query }){
    let { category } = query;
    let products = [];
    
    if(category == undefined){
        products = await getProducts();
    }else{
        products = await getProductsByCategory(category);
    }

    let categories = await getCategories();
    
    return { props:{ products, categories, category: category != undefined ? query.category : "All" } };
}

export default function Products_({ products,categories,category }){
    return(
        <div className={styles.container}>
            <Navigation page={"products"}/>
            <Products categories={categories} products={products} category={category}/>
        </div>
    )
}

const styles = {
    container:"w-screen flex flex-row h-screen",
}