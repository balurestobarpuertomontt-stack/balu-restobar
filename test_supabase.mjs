// Define a dummy WebSocket class for Node < 22 to prevent @supabase/supabase-js from throwing
global.WebSocket = class {};

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Manually parse .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Has Service Key:", !!supabaseServiceKey);
console.log("Has Anon Key:", !!supabaseAnonKey);

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

const keyToUse = supabaseServiceKey || supabaseAnonKey;
const clientType = supabaseServiceKey ? "Service Role" : "Anon";
console.log(`Initializing client with ${clientType} key...`);

const supabase = createClient(supabaseUrl, keyToUse);

async function testConnection() {
  console.log("\n1. Testing connection / querying 'products' table...");
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .limit(5);

  if (productsError) {
    console.error("❌ Error querying 'products' table:", productsError.message);
    console.error("Details:", productsError);
  } else {
    console.log("✅ Successfully queried 'products' table!");
    console.log(`Found ${products.length} products.`);
    if (products.length > 0) {
      console.log("Sample products:");
      for (const p of products) {
        console.log(`- ${p.name} (${p.category}): $${p.price}`);
      }
    }
  }

  console.log("\n2. Checking other tables...");
  const tables = ["orders", "reservations", "events", "coupons", "loyalty_accounts", "gallery"];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("count", { count: "exact", head: true });
    if (error) {
      console.log(`❌ Table '${table}': Not found or error (${error.message})`);
    } else {
      const count = data && data[0] ? data[0].count : 0;
      console.log(`✅ Table '${table}': Exists (row count: ${count})`);
    }
  }
}

testConnection().catch(err => {
  console.error("Unexpected error during test:", err);
});
