import Navigation from "../../components/admin/Navigation";
import Products from "../../components/admin/Products";
import { getData } from "../../database/client";

export async function getServerSideProps({ req,query }){
    if(query.category != undefined){
        var products = await getData('*[_type=="products" && category->name==$category_name]{_id,name,"images":images[]{"_id":asset->_id,"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]} | order(@._createdAt desc)',{ category_name:query.category });
    }else{
        var products = await getData('*[_type=="products"]{_id,name,"images":images[]{"_id":asset->_id,"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]} | order(@._createdAt desc)',{});
    }
    var categories = await getData('*[ _type=="categories"]{_id,name,icon }',{});
    return {
        props:{
            products,categories,category:query.category != undefined ? query.category : "All"
        }
    }
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