// Supabase Configuration
// Important: Replace YOUR_SUPABASE_ANON_KEY with your actual key from Supabase dashboard

const SUPABASE_URL = 'https://qcqutpshkjpyorpdmnvz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YEhb9BxkzhcD6ecEKlV-4g_Y3gsYvkM'; // Replace with your actual key

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabaseClient, SUPABASE_URL, SUPABASE_ANON_KEY };
}
