import { jwtVerify,importSPKI,SignJWT,importPKCS8 } from "jose";
import { PrivateKey,PublicKey } from "./gloabal";
import { NextResponse,NextRequest } from 'next/server';
const STATIC_PROTECTED_ROUTES = ["/","/check_out","/api/user/check_out","/api/user/search"];

export default async function middleware(req,res){
    //console.log('\x1b[33m%s\x1b[0m', "path:",req.nextUrl.pathname);
    if(STATIC_PROTECTED_ROUTES.includes(req.nextUrl.pathname) || req.nextUrl.pathname.startsWith('/categories') || req.nextUrl.pathname.startsWith('/my_profile')) {
        try {
            var key = await importSPKI(PublicKey,"RS256");
            var decoded = await jwtVerify(req.cookies.get("access_token") || req.headers.get("authorization"),key,{ algorithms:["RS256"] });
        } catch (err) {
            console.log(err);
            return NextResponse.redirect(new URL('/user/sign_in', req.url));
        } finally {
            if(decoded != undefined){
                var response = NextResponse.next();
                return response;
            }else{
                return NextResponse.redirect(new URL('/user/sign_in', req.url));
            }
        }
    }

    if(req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')){
        try {
            var key = await importSPKI(PublicKey,"RS256");
            var decoded = await jwtVerify(req.cookies.get("access_token") || req.headers.get("authorization"),key,{ algorithms:["RS256"] });
        } catch (err) {
            return NextResponse.redirect(new URL('/user/sign_in', req.url));
        } finally {
            if(decoded != undefined){
                if(decoded.payload.role == "admin"){
                    return NextResponse.next();
                }else{
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }else{
                return NextResponse.redirect(new URL('/user/sign_in', req.url));
            }
        }
    }
}