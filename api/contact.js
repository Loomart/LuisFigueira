import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // 1. Check if Supabase is configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      
      const { error } = await supabase
        .from('messages')
        .insert([{ name, email, message }]);

      if (error) throw error;
      
      console.log(`Message saved to Supabase: ${email}`);
    } else {
      // Fallback: Log to Vercel Console if Supabase is not configured
      console.log('--- NEW MESSAGE (No DB Configured) ---');
      console.log(`From: ${name} <${email}>`);
      console.log(`Message: ${message}`);
    }

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return res.status(200).json({ 
      success: true, 
      message: 'Message received' 
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
