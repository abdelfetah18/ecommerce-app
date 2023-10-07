import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'a6hagb75',
  dataset: 'production',
  apiVersion: '2022-08-05',
  token: "skWxI4flcQ6IoBMNDpL4GF2DdSlfyRGNmCDbURaN5yANRU92jUeBfAfru2iOc1Fafo0KFs9F9ySNbFoMVsOT4GrHFZcwKwTj86c02mJClpCDmb3kI1ACmOtKpvaHD0roEjGlHT4peo9NsiIej3XCOYpUht485aEqIP9xpqwz7qkB8bgH3Jt7",
  useCdn: false,
});


/*
client.delete({
  query: `*[_type == "users"]`
}).then((res) => console.log('deleted all:',res))
*/

import { basename } from 'path';
import { createReadStream } from 'fs';

// QUERY_PROPS
const user_props = `{ _id, username, email, "profile_image" : profile_image.asset->url, total_revenue }`;
const price_props = `{ _id, value, currency }`;
const product_props = `{ _id, name, "images": images[]{ "url" : asset->url }, category-> , description, price->${price_props} }`;
const category_props = `{ _id, name, icon }`;
const order_props = `{ _id, state, products[]->${product_props}, payment_method, _createdAt }`;

async function getUser(user_id){
  const query = `*[_type=="users" && (_id==$user_id || username==$user_id)]${user_props}[0]`;
  return await client.fetch(query, { user_id });
}

async function getUserWithPassword(user_id){
  const query = `*[_type=="users" && (_id==$user_id || username==$user_id)][0]`;
  return await client.fetch(query, { user_id });
}

async function createUser(username, email, password){
  let user_doc = { _type:"users", username, email, password, role:"user", email_verify: false, sign_up_with: "email" };
  return await client.create(user_doc);
}

async function getProducts(){
  const query = `*[_type=="products"]${product_props}`;
  return await client.fetch(query);
}

async function getProductsByCategory(category_name){
  const query = `*[_type=="products" && category->name==$category_name]${product_props}`;
  return await client.fetch(query, { category_name });
}

async function getProductsByFilters(search, filters){
  let products_query = '*[_type=="products" && (name match $name || category->name match $name) ';
  if(filters.category)
    products_query += ' && category->name == $category';
  
  products_query += ']{ _id, name, "images": images[].asset->, category->, description, price->}'
  if(filters.order_by){
    switch(filters.order_by){
      case "price":
        products_query += ' | order(price.value desc)';
        break;
      case "name":
        products_query += ' | order(name desc)';
        break;
    }
  }
  
  return await client.fetch(products_query, { name: search+"*", category: filters.category ? filters.category.name : "" });
}

async function getCategories(){
  const query = `*[_type=="categories"]${category_props}`;
  return await client.fetch(query);
}

async function getUserOrdersByState(user_id, state){
  const query = `*[_type=="orders" && user._ref == $user_id && state == $state]${order_props}`;
  return await client.fetch(query, { user_id, state });
}

async function getUserOrders(user_id){
  const query = `*[_type=="orders" && user._ref == $user_id]${order_props}`;
  return await client.fetch(query, { user_id });
}

async function getTodayOrders(){
  let today = new Date();
  
  let dd = (today.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
  let mm = (today.getMonth()+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  let yy = today.getFullYear();

  const query = `*[_type=="orders" && state != "Not Processing" && _createdAt >= $today]${order_props}`;
  return await client.fetch(query,{ today:`${yy}-${mm}-${dd}` });
}

async function getLastMounthUserOrders(username){
  let today = new Date();
  
  let dd = (today.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
  let mm = (today.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  let yy = today.getFullYear();
  
  const query = `*[_type=="orders" && user->username==$username && _createdAt >= $mounth_before]{ _id, _createdAt, products[]->${product_props}, payment_method, state, user->${user_props} }`;
  return await client.fetch(query,{ username, mounth_before:yy+"-"+mm+"-"+dd });
}

async function getTotalCustomers(){
  const query = '{"total_custumers":count(*[_type=="users" && role!="admin"]),}';
  return await client.fetch(query);
}

async function getLastOrders(){
  const query = `*[_type=="orders"]{ _id, _createdAt, products[]->${product_props}, payment_method, state, user->${user_props}}[0..4] | order(_createdAt desc)`;
  return await client.fetch(query);
}

async function getOrders(){
  const query = `*[_type=="orders"]{ _id, _createdAt, products[]->${product_props}, payment_method, state, user->${user_props}} | order(_createdAt desc)`;
  return await client.fetch(query);
}

async function getUserRevenue(username){
  const query = `*[_type=="users" && username==$username]{ _id, username, total_revenue, "profile_image": profile_image.asset->url, "orders_count": count(*[_type=="orders" && user->username==$username]) }[0]`;
  return await client.fetch(query,{ username });
}


async function getData(query,params){
  return await client.fetch(query, params);
}

async function addData(doc){
  return await client.create(doc);
}

async function updateData(doc_id,new_doc){
  return await client.patch(doc_id).set(new_doc).commit();
}

async function uploadProfile(filePath,doc_id){
  console.log('file_path:',filePath)
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  var doc_info = await client.patch(doc_id).set({
      profile_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
  }).commit()
  return { ...doc_info,profile_image:imageAsset }
}

async function uploadImage(filePath){
  console.log('file_path:',filePath)
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  
  return { image:imageAsset }
}

function deleteOrders(){
  client.delete({ query:"*[_type=='orders']" }).then((r) => console.log(r)).catch((err) => console.log("delete orders err:",err))
}

async function newOrder(user_id,total){
  try {
    var r_1 = await client.patch({ query:'*[_type=="users" && role=="admin"]' }).inc({ total_revenue: total }).commit();
    var r_2 = await client.patch(user_id).inc({ total_revenue: total }).commit();
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    return [r_1,r_2]
  }
}

export {
  getUser, getUserWithPassword, createUser, getProducts, getProductsByCategory, getProductsByFilters, getCategories,
  getUserOrdersByState, getUserOrders, getTodayOrders, getTotalCustomers, getLastOrders, getOrders,
  getLastMounthUserOrders, getUserRevenue,
  updateData,getData,addData,uploadProfile,uploadImage,deleteOrders,newOrder
};