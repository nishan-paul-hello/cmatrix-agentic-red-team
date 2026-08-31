import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get("auth");
    const isAuthenticated = authCookie?.value === "1";

    const isRootPage = request.nextUrl.pathname === "/";

    // If not authenticated and not on root page, redirect to root
    if (!isAuthenticated && !isRootPage) {
        return NextResponse.redirect(new URL("/", request.url));
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
         * - any files in the public folder (e.g. .svg, .png, .jpg)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
    ],
};
