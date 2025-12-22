import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authorization Check
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== 'Bearer admin123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Debug: Check for environment variables
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_ANON_KEY;

    // 1. Check if Supabase is configured
    if (hasUrl && hasKey) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      
      // Fetch messages ordered by date
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase format to our frontend format
      const messages = data.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        date: msg.created_at
      }));

      return res.status(200).json(messages);

    } else {
      // Fallback: Show system message with specific debug info
      const missing = [];
      if (!hasUrl) missing.push("SUPABASE_URL");
      if (!hasKey) missing.push("SUPABASE_ANON_KEY");

      return res.status(200).json([
        {
          id: 0,
          name: "Sistema Vercel (Debug)",
          email: "debug@vercel.app",
          message: `⚠️ Base de datos no conectada.\n\nFaltan las siguientes variables de entorno:\n👉 ${missing.join(', ')}\n\nAsegúrate de que están añadidas en Vercel (Settings > Environment Variables) y que marcaste la casilla "Production".`,
          date: new Date().toISOString()
        }
      ]);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: `Error retrieving messages: ${error.message}` });
  }
}
