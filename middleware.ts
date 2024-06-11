import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from 'next/server';

const ONLY_ADMIN_API_ROUTES = [
    "/api/admin/change_state",
    "/api/admin/categories/create",
    "/api/admin/categories/delete",
    "/api/admin/layout_contents/update_banner_image",
    "/api/admin/layout_contents/update_banner",
    "/api/admin/layout_contents/update_logo",
    "/api/admin/products/create",
    "/api/admin/products/delete",
    "/api/admin/products/update",
    "/api/admin/products/upload_images",
];

const GUEST_DENIED_ROUTES = [
    "/api/user/upload_profile_image",
    "/api/create-payment-intent",
    "/api/verify-payment-intent"
];

const WHITELIST_ROUTES = [
    "/api/user/sign_in",
    "/api/user/sign_up",
];

export default async function middleware(req: NextRequest) {
    const path: string = req.nextUrl.pathname;
    // console.log('\x1b[33m%s\x1b[0m', "path:", path);

    if (WHITELIST_ROUTES.includes(path)) {
        return NextResponse.next();
    }

    if (path.startsWith('/api/admin')) {
        const accessToken = req.headers.get("authorization");
        const jwtSecret = Buffer.from(process.env.JWT_SECRET);
        const jwtVerifyResult = await jwtVerify(accessToken, jwtSecret, { algorithms: ["HS256"] });
        const user = jwtVerifyResult.payload;

        if (user.role == "guest" && ONLY_ADMIN_API_ROUTES.includes(path)) {
            return NextResponse.json({ status: 'error', message: 'Only admin accounts are permitted for this action. Guest accounts are not allowed.' });
        }

        if (user.role == "guest") {
            return NextResponse.next();
        }

        if (user.role == "admin") {
            return NextResponse.next();
        }

        return NextResponse.json({ status: 'error', message: 'Only admin accounts are permitted for this action.' });
    }

    if (path.startsWith('/api')) {
        const accessToken = req.headers.get("authorization");
        const jwtSecret = Buffer.from(process.env.JWT_SECRET);
        const jwtVerifyResult = await jwtVerify(accessToken, jwtSecret, { algorithms: ["HS256"] });
        const user = jwtVerifyResult.payload;

        if (user.role == "guest" && GUEST_DENIED_ROUTES.includes(path)) {
            return NextResponse.json({ status: 'error', message: 'Guest accounts are not permitted for this action.' });
        }

        if (user.role == "guest" && path == "/api/user" && req.method == "POST") {
            return NextResponse.json({ status: 'error', message: 'Guest accounts are not permitted for this action.' });
        }

        return NextResponse.next();
    }
}