import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** `supabase.auth.getUser()` re-verifies the session against the Auth server
 *  on every call (by design — safer than trusting the cookie). The layout
 *  and every page each need the user, which used to mean one round trip per
 *  call; `cache()` memoizes this per request, so it actually runs once. */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});
