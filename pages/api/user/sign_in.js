import { addData, getData } from "../../../database/client";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrivateKey,PublicKey } from "../../../gloabal";
import { serialize } from 'cookie';
import { SignJWT,importPKCS8 } from "jose";

export default async function handler(req, res) {
    if(req.method === "POST"){
        var data = req.body;
        getData('*[_type=="users" && @.username==$username]',{ username:data.username }).then((result) => {
            if(result.length > 0){
                bcrypt.compare(data.password,result[0].password).then((is_valid) => {
                    if(is_valid){
                        var payload = { user_id:result[0]._id,username:result[0].username, email:result[0].email, role:result[0].role, profile_image:result[0].profile_image };
                        var jwtSigner = new SignJWT(payload);
                        jwtSigner.setProtectedHeader({ alg:"RS256", b64:true });
                        jwtSigner.setExpirationTime("24h");
                        importPKCS8(PrivateKey,"RS256").then((key) => {
                            jwtSigner.sign(key).then((encoded) => {
                                res.setHeader('Set-Cookie', serialize('access_token', encoded, { path:"/" }));
                                res.status(200).json({
                                    status:"success",
                                    message:"Sign in successfuly!",
                                    access_token: encoded
                                });
                            }).catch((err) => {
                                res.status(200).json({
                                    status:"error",
                                    message:"Something went wrong!"
                                });
                            });
                        });
                    }else{
                        res.status(200).json({
                            status:"error",
                            message:"Something wrong with your password!"
                        });
                    }
                }).catch((err) => {
                    res.status(200).json({
                        status:"error",
                        message:"Something wrong with your password!"
                    });
                });
            }else{
                res.status(200).json({
                    status:"error",
                    message:"Account not found!"
                });
            }
        }).catch((err) => {
            res.status(200).json({
                status:"error",
                message:"something went wrong!"
            });
        });
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}
