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
  updateData,getData,addData,uploadProfile,uploadImage,deleteOrders,newOrder
};