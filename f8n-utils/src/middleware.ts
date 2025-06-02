import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/utils";

export const updateSession = async <Token>(
  request: NextRequest,
  redirectConfig: {
    redirectPredicate: (token: Token | null, path: string) => boolean;
    redirectTo: string;
  }[],
  authConfig: (
    | {
        paths: string[];
        pathPrefixes?: string[];
        authPredicate: (token: Token | null) => boolean;
      }
    | {
        paths?: string[];
        pathPrefixes: string[];
        authPredicate: (token: Token | null) => boolean;
      }
    | {
        paths: string[];
        pathPrefixes: string[];
        authPredicate: (token: Token | null) => boolean;
      }
  )[],
  fallbackRedirectTo: string,
) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const token = await getTokenFromRequest<Token>(supabase);

  for (const redirect of redirectConfig) {
    if (redirect.redirectPredicate(token, request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(redirect.redirectTo, request.url));
    }
  }

  if (
    !authConfig.some(
      (config) =>
        (config.paths?.includes(request.nextUrl.pathname) ||
          config.pathPrefixes?.some((prefix) =>
            request.nextUrl.pathname.startsWith(prefix),
          )) &&
        config.authPredicate(token),
    )
  ) {
    return NextResponse.redirect(new URL(fallbackRedirectTo, request.url));
  }

  return response;
};
