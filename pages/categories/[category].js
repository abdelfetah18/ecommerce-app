import { useState } from "react";
import Categories from "../../components/Categories";
import Header from "../../components/Header";
import Search from "../../components/Search";
import Shop from "../../components/Shop";
import { getData } from "../../database/client";

export async function getServerSideProps({ req,params }){
  var category_name = params.category;
  if(req.cookies.access_token != undefined){
    var products = await getData('*[_type=="products" && category->name==$category_name]{_id,name,"images":images[]{"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]}',{ category_name });
    var categories = await getData('*[ _type=="categories"]{_id,name,icon }');
    return {
      props:{
        products,category_name,categories
      }
    }
  }else{
    return {
      redirect: {
        destination: '/user/sign_in',
        permanent: false,
      },
    }
  }
}

export default function Home({ products,category_name,categories }) {
  var [_products,setProducts] = useState(products);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Header />
      <Categories category_name={category_name} categories={categories} />
      <div className="flex flex-row w-11/12 mt-10 flex-grow">
        <Search search={[_products,setProducts]} categories={categories} />
        <Shop category_name={category_name} products={products} />
      </div>
    </div>
  )
}