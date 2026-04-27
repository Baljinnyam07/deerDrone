import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { error: error1 } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE leads ADD COLUMN IF NOT EXISTS sender_id TEXT;' });
  console.log("sender_id", error1 || 'ok');
  
  const { error: error2 } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;' });
  console.log("notes", error2 || 'ok');
}
main();
