import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("auth");
    const isAuthenticated = authCookie?.value === "1";

    const isLoginPage = request.nextUrl.pathname === "/login";
    const isRootPage = request.nextUrl.pathname === "/";

    // If authenticated and trying to access login, redirect to dashboard
    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If not authenticated and not on login page or root page, redirect to login
    if (!isAuthenticated && !isLoginPage && !isRootPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - any files in the public folder (e.g. .svg)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
    ],
};
