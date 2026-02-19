import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kcnxfmrpbdbkmgoqhqjv.supabase.co";
const supabaseKey = "sb_publishable_myyjDVvc2vmBXhYwTvy7aA_5v9Wrx0F";

export const supabase = createClient(supabaseUrl, supabaseKey);
