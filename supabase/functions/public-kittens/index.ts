import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for public-kittens function');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface PublicKitten {
  id: string;
  name: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('public-kittens: loading available kittens');

    // Load all kittens (service role bypasses RLS, so we must filter carefully)
    const { data: kittens, error: kittensError } = await supabase
      .from('kittens')
      .select('id, name')
      .order('created_at', { ascending: true });

    if (kittensError) {
      console.error('public-kittens: error loading kittens', kittensError);
      throw kittensError;
    }

    // Load kitten assignments to clients
    const { data: assignments, error: assignmentsError } = await supabase
      .from('client_kittens')
      .select('kitten_id');

    if (assignmentsError) {
      console.error('public-kittens: error loading assignments', assignmentsError);
      throw assignmentsError;
    }

    const assignedIds = new Set((assignments || []).map((a) => a.kitten_id as string));

    // Keep only kittens that are NOT assigned to any client
    const availableKittens: PublicKitten[] = (kittens || []).filter((kitten) => !assignedIds.has(kitten.id));

    console.log('public-kittens: available kittens:', availableKittens);

    // For each available kitten, load its first photo
    const kittensWithPhotos = await Promise.all(
      availableKittens.map(async (kitten) => {
        const { data: media, error: mediaError } = await supabase
          .from('kitten_media')
          .select('file_url')
          .eq('kitten_id', kitten.id)
          .eq('media_type', 'photo')
          .order('created_at', { ascending: true })
          .limit(1);

        if (mediaError) {
          console.error('public-kittens: error loading media for kitten', kitten.id, mediaError);
        }

        return {
          id: kitten.id,
          name: kitten.name,
          image: media?.[0]?.file_url || null,
        };
      })
    );

    return new Response(
      JSON.stringify({ kittens: kittensWithPhotos }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('public-kittens: unexpected error', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load kittens' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
