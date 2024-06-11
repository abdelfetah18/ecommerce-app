import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'a6hagb75',
  dataset: 'production',
  apiVersion: '2022-08-05',
  token: "skWxI4flcQ6IoBMNDpL4GF2DdSlfyRGNmCDbURaN5yANRU92jUeBfAfru2iOc1Fafo0KFs9F9ySNbFoMVsOT4GrHFZcwKwTj86c02mJClpCDmb3kI1ACmOtKpvaHD0roEjGlHT4peo9NsiIej3XCOYpUht485aEqIP9xpqwz7qkB8bgH3Jt7",
  useCdn: false,
});

export default client;

/*
client.delete({
  query: `*[_type == "users"]`
}).then((res) => console.log('deleted all:',res))
*/

import { basename } from 'path';
import { readFileSync } from 'fs';
import moment from 'moment';

// QUERY_PROPS
const user_props = `{ _id, username, email, "profile_image" : profile_image.asset->url, total_revenue }`;
const price_props = `{ _id, value, currency }`;
const product_props = `{ _id, name, "images": images[]{ "url" : asset->url }, category-> , description, price->${price_props} }`;
const category_props = `{ _id, name, icon }`;
const order_props = `{ _id, state, products[]->${product_props}, payment_method, _createdAt }`;

async function createUser(username, email, password) {
  let user_doc = { _type: "users", username, email, password, role: "user", email_verify: false, sign_up_with: "email" };
  return await client.create(user_doc);
}

async function getTotalCustomers() {
  const query = '{"total_custumers":count(*[_type=="users" && role!="admin"]),}';
  return await client.fetch(query);
}

async function getUserRevenue(userId) {
  const query = `*[_type=="users" && _id==$userId]{ _id, username, total_revenue, "profile_image": profile_image.asset->, "orders_count": count(*[_type=="orders" && user._ref==$userId]) }[0]`;
  return await client.fetch(query, { userId });
}

async function getData(query, params) {
  return await client.fetch(query, params);
}

async function addData(doc) {
  return await client.create(doc);
}

async function updateData(doc_id, new_doc) {
  return await client.patch(doc_id).set(new_doc).commit();
}

async function uploadProfile(filePath:string, docId:string) {
  console.log('file_path:', filePath)
  try {
    var imageAsset = await client.assets.upload('image', readFileSync(filePath), { filename: basename(filePath) });
  } catch (err) {
    console.log('db_error:', err)
  }
  var doc_info = await client.patch(docId).set({
    profile_image: {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: imageAsset._id
      }
    }
  }).commit()
  return { ...doc_info, profile_image: imageAsset }
}

async function uploadImage(filePath) {
  console.log('file_path:', filePath)
  try {
    var imageAsset = await client.assets.upload('image', readFileSync(filePath), { filename: basename(filePath) });
  } catch (err) {
    console.log('db_error:', err)
  }

  return { image: imageAsset }
}

function deleteOrders() {
  client.delete({ query: "*[_type=='orders']" }).then((r) => console.log(r)).catch((err) => console.log("delete orders err:", err))
}

async function newOrder(user_id, total) {
  try {
    var r_1 = await client.patch({ query: '*[_type=="users" && role=="admin"]' }).inc({ total_revenue: total }).commit();
    var r_2 = await client.patch(user_id).inc({ total_revenue: total }).commit();
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    return [r_1, r_2]
  }
}

async function getDashboardStats(): Promise<DashboardStats> {
  return await client.fetch<DashboardStats>(`{
    "todayRevenue": math::sum(*[_type == "orders" && dateTime(_createdAt) >= dateTime($todayDate)].products[]->price->value),
    "todayRevenuePercentage": ((math::sum(*[_type == "orders" && dateTime(_createdAt) >= dateTime($todayDate)].products[]->price->value) - math::sum(*[_type == "orders" && dateTime(_createdAt) >= dateTime($yesterdayDate) && dateTime(_createdAt) < dateTime($todayDate)].products[]->price->value)) / math::sum(*[_type == "orders"].products[]->price->value)) * 100,
    "totalCustomers": count(*[_type == "users"]),
    "totalCustomersPercentage": count(*[_type == "users" && dateTime(_createdAt) >= dateTime($todayDate)]) /count(*[_type == "users"]) * 100,
    "totalRevenue": math::sum(*[_type == "orders"].products[]->price->value),
    "totalRevenuePercentage": math::sum(*[_type == "orders" && dateTime(_createdAt) >= dateTime($todayDate)].products[]->price->value) / math::sum(*[_type == "orders"].products[]->price->value) * 100
  }`, {
    todayDate: moment().startOf('day'),
    yesterdayDate: moment().subtract(1, 'days').startOf('day'),
  });
}

export {
  createUser,
  getTotalCustomers,
  getUserRevenue,
  updateData,
  getData,
  addData,
  uploadProfile,
  uploadImage,
  deleteOrders,
  newOrder,
  getDashboardStats
};