This is a [Next.js](https://nextjs.org/) ecommerce web app
## Getting Started

First, run build:

```bash
npm run build
# or
yarn build
```
then 
```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

1. manage orders,products. (create,edit,delete,update).
2. statistics about revenue,and how many clients you have and some statics about every client. 

## Technology used in this app

for the database, recently, i am using [`sanity.io`](https://sanity.io) , ( `Sanity` is the unified content platform that lets your team work together in real-time to build engaging digital experiences across channels. )


### Database Schema:

```json
[
    {
      title:"users",
      name:"users",
      type:"document",
      initialValue:{
        total_revenue:0
      },
      fields:[
        {
          title:"username",
          name:"username",
          type:"string"
        },
        {
          title:"email",
          name:"email",
          type:"string"
        },
        {
          title:"profile_image",
          name:"profile_image",
          type:"image"
        },
        {
          title:"password",
          name:"password",
          type:"string"
        },
        {
          title:"role",
          name:"role",
          type:"string",
          options:{
            list:[
              { title:"admin",value:"admin" },
              { title:"user",value:"user" },
            ]
          }
        },
        {
          title:"email_verify",
          name:"email_verify",
          type:"boolean"
        },
        {
          title:"sign_up_with",
          name:"sign_up_with",
          type:"string",
          options:{
            list:[
              { title:"email",value:"email" },
              { title:"google",value:"google" },
            ]
          }
        },
        {
          title:"total_revenue",
          name:"total_revenue",
          type:"number"
        }
      ]
    },
    {
      title:"orders",
      name:"orders",
      type:"document",
      fields:[
        {
          title:"products",
          name:"products",
          type:"array",
          of:[{ type:"reference", to: { type:"products" } }]
        },
        {
          title:"user",
          name:"user",
          type:"reference",
          to: { type:"users" }
        },
        {
          title:"state",
          name:"state",
          type:"string",
          options:{
            list:[
              { title:"Not processed", value:"Not processed" },
              { title:"Processing", value:"Processing" },
              { title:"Shipped", value:"Shipped" },
              { title:"Delivered", value:"Delivered" },
              { title:"Cancelled", value:"Cancelled" },
            ]
          }
        },
        {
          title:"payment_method",
          name:"payment_method",
          type:"string",
          options:{
            list:[
              { title:"PayPal", value:"PayPal" },
              { title:"CreditCard", value:"CreditCard" }
            ]
          }
        }
      ]
    },
    {
      title:"products",
      name:"products",
      type:"document",
      fields:[
        {
          title:"name",
          name:"name",
          type:"string"
        },
        {
          title:"images",
          name:"images",
          type:"array",
          of:[{ type:"image" }]
        },
        {
          title:"category",
          name:"category",
          type:"reference",
          to:{ type:"categories" }
        },
        {
          title:"description",
          name:"description",
          type:"string"
        },
        {
          title:"price",
          name:"price",
          type:"reference",
          to: { type:"prices" }
        },
        {
          title:"added_by",
          name:"added_by",
          type:"reference",
          to: { type:"users" }
        }
      ]
    },
    {
      title:"categories",
      name:"categories",
      type:"document",
      fields:[
        {
          title:"name",
          name:"name",
          type:"string"
        },
        {
          title:"icon",
          name:"icon",
          type:"image"
        }
      ]
    },
    {
      title:"prices",
      name:"prices",
      type:"document",
      fields:[
        {
          title:"product",
          name:"product",
          type:"reference",
          to: { type:"products" }
        },
        {
          title:"value",
          name:"value",
          type:"number"
        },
        {
          title:"currency",
          name:"currency",
          type:"string",
          options:{
            list:[
              { title:"USD",value:"USD" },
              { title:"EURO",value:"EURO" },
              { title:"DZD",value:"DZD" }
            ]
          }
        }
      ]
    }
  ]
```

---

For Authentication and Authorization i am using `JWT (JSON Web Token)`.i am using it in middlewares.
[`jose`](https://www.npmjs.com/package/jose) library for the `NextJS` Edge Runtime.

---

## Images from the app
![1](https://raw.githubusercontent.com/abdelfetah18/ecommerce-app/main/public/1.png)
![2](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/2.png)
![3](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/3.png)
![4](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/4.png)
![5](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/5.png)
![6](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/6.png)
![7](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/7.png)


Thanks for reading and see you in my next project.