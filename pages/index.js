import Categories from "../components/Categories";
import Header from "../components/Header";
import Search from "../components/Search";
import Shop from "../components/Shop";
import { getData } from "../database/client";
import { decodeJwt } from "jose";
import { useState } from "react";

export async function getServerSideProps({ req }){
  var user = decodeJwt(req.cookies.access_token);
  var products = await getData('*[_type=="products"]{_id,name,"images":images[]{"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]}',{});
  var categories = await getData('*[ _type=="categories"]{_id,name,icon }');
  var user_info = await getData('*[_type=="users" && _id==$user_id]{_id,username,email,"profile_image":profile_image.asset->url}',{ user_id:user.user_id});

  return {
    props:{
      products,categories,user:user_info[0]
    }
  }
}

export default function Home({ products,categories,user }) {
  const category_name = "All";
  var [_products,setProducts] = useState(products);
  
  return (
    <div className="w-screen h-screen flex flex-col items-center overflow-auto bg-slate-50">
      <Header user={user} />
      <Categories category_name={category_name} categories={categories} />
      <div className="flex flex-row w-11/12 mt-10 flex-grow">
        <Search search={[_products,setProducts]} categories={categories} />
        <Shop category_name={category_name} products={_products} />
      </div>
    </div>
  )
}