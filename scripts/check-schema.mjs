import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const tables = ["categories", "accounts", "goals", "transactions"];
let allOk = true;

for (const table of tables) {
  const { data, error, status, count } = await supabase.from(table).select("id", { count: "exact" });
  if (error) {
    allOk = false;
    console.log(`❌ ${table}: ${error.message} (status ${status})`);
  } else {
    const rlsOk = count === 0 && (data ?? []).length === 0;
    console.log(`${rlsOk ? "✅" : "⚠️ "} ${table}: reachable, count=${count}, rows returned=${(data ?? []).length} ${rlsOk ? "(RLS correctly hides all rows with no session)" : "(unexpected — RLS may not be active!)"}`);
    if (!rlsOk) allOk = false;
  }
}

// Also try to insert without a session — should be rejected by RLS (no valid auth.uid()).
const { error: insertError } = await supabase.from("categories").insert({ name: "RLS probe — should fail" });
if (insertError) {
  console.log(`✅ anonymous insert correctly rejected: ${insertError.message}`);
} else {
  allOk = false;
  console.log("⚠️  anonymous insert SUCCEEDED — RLS is not enforcing owner checks on insert!");
}

process.exit(allOk ? 0 : 1);
