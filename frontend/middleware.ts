
import { NextResponse } from "next/server";
import type { NextRequest, MiddlewareConfig } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

const publicRoutes = ["/", "/login", "/register"];
const protectedRoutes = [""];
const adminRoutes = ["/admin/store/", "/admin/store/create", "/admin/store/products", "/admin/store/edit", "/admin/store/products"];

function match(pathname: string, patterns: string[]) {
  return patterns.some(pattern => {
    const regex = new RegExp("^" +
      pattern.replace(/:\w+/g, "[^/]+")
             .replace(/\*/g, ".*")
      + "$");
    return regex.test(pathname);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;


  if (match(pathname, publicRoutes)) {
    if (token && ["/login","/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (match(pathname, protectedRoutes)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, jwtSecret);
      return NextResponse.next();
    } catch {

      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }


  if (match(pathname, adminRoutes)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const { payload }: any = await jwtVerify(token, jwtSecret);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  //tratar para 404
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
