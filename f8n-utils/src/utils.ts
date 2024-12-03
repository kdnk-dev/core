import { SupabaseClient } from "@supabase/supabase-js";
import { AuthError, Session } from "@supabase/auth-js";
import { jwtDecode } from "jwt-decode";

export function getToken<TokenType>(
  session:
    | { data: { session: Session }; error: null }
    | { data: { session: null }; error: AuthError }
    | { data: { session: null }; error: null },
) {
  if (session.data.session) {
    return jwtDecode<TokenType>(session.data.session.access_token);
  } else {
    return {} as TokenType;
  }
}

export async function getTokenFromRequest<TokenType>(
  client: SupabaseClient,
): Promise<TokenType | null> {
  const user = await client.auth.getUser();

  return !user.error && user.data.user
    ? getToken<TokenType>(await client.auth.getSession())
    : null;
}
