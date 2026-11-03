const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_KEY is missing or using placeholder in .env!');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

module.exports = supabase;
