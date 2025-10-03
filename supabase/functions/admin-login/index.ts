import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    
    // Validate password server-side
    if (password !== 'DRAINER') {
      return new Response(
        JSON.stringify({ error: 'Access Denied – Incorrect Password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if admin user exists, create if not
    const adminEmail = 'admin@cryptotrade.com';
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    
    let adminUser = existingUser?.users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
      // Create admin user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: 'DRAINER',
        email_confirm: true,
      });

      if (createError) throw createError;
      adminUser = newUser.user;

      // Add admin role
      await supabase.from('user_roles').insert({
        user_id: adminUser.id,
        role: 'admin'
      });
    }

    // Sign in as admin
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'DRAINER',
    });

    if (signInError) throw signInError;

    // Log admin login
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    await supabase.from('admin_logs').insert({
      admin_id: adminUser.id,
      action: 'admin_login',
      details: { method: 'password' },
      ip_address: clientIp
    });

    return new Response(
      JSON.stringify({ 
        session: session.session,
        user: session.user 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin login error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Login failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
