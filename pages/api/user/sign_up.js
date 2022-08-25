import { addData, getData } from "../../../database/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if(req.method === "POST"){
        var data = req.body;
        if(data.username.length > 0 && data.email.length > 0 && data.password.length > 6 && isValidEmail(data.email)){
            try {
                var salt = await bcrypt.genSalt(Math.floor(Math.random()*10));
                var hashed_pwd = await bcrypt.hash(data.password,salt);
            } catch (err) {
                res.status(500).json({
                    status:"error",
                    message:"something went wrong!"
                });
            } finally {
                getData('*[ _type=="users" && @.username==$username ]',{ username:data.username }).then((r) => {
                    if(r.length > 0){
                        res.status(200).json({
                            status:"error",
                            message:"username already used!"
                        });
                    }else{
                        var user_doc = { _type:"users", username:data.username, email:data.email, password:hashed_pwd, role:"user", email_verify:false, sign_up_with:"email" };
                        addData(user_doc).then((result) => {
                            res.status(200).json({
                                statsu:"success",
                                message:"user signed up successfuly!"
                            });
                        }).catch((err) => {
                            res.status(200).json({
                                status:"error",
                                message:"something went wrong! please try again!"
                            });
                        });
                    }
                }).catch((err) => {
                    res.status(200).json({
                        status:"error",
                        message:"something went wrong! please try again!",err
                    });
                });
            }
        }else{
            res.status(200).json({
                status:"error",
                message:"something wrong with your inputs!"
            });
        }
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}