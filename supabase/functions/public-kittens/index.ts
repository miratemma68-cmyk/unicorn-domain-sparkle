import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

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
    // Extract auth token from request headers
    const authHeader = req.headers.get('authorization');
    let currentUserId: string | null = null;

    // If there's an auth token, create an authenticated client to get the user
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { authorization: authHeader } },
      });
      const { data: { user }, error: userError } = await userClient.auth.getUser();
      if (!userError && user) {
        currentUserId = user.id;
        console.log('public-kittens: authenticated user detected', currentUserId);
      }
    }

    // Try to read JSON body (used for detail view); ignore errors if no body
    let body: any = null;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      try {
        body = await req.json();
      } catch {
        body = null;
      }
    }

    const kittenId = body?.id as string | undefined;

    // If an id is provided, return a single kitten detail
    if (kittenId) {
      console.log('public-kittens: loading kitten detail for id', kittenId);

      const { data: kitten, error: kittenError } = await supabase
        .from('kittens')
        .select('id, name, birth_date, gender, color, current_weight, breed_info, created_at, updated_at')
        .eq('id', kittenId)
        .maybeSingle();

      if (kittenError) {
        console.error('public-kittens: error loading kitten detail', kittenError);
        throw kittenError;
      }

      if (!kitten) {
        console.warn('public-kittens: kitten not found for id', kittenId);
        return new Response(
          JSON.stringify({ kitten: null }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      // Check if the kitten is assigned to a client
      const { data: assignment, error: assignmentError } = await supabase
        .from('client_kittens')
        .select('id, client_id')
        .eq('kitten_id', kittenId)
        .maybeSingle();

      if (assignmentError) {
        console.error('public-kittens: error checking kitten assignment', assignmentError);
        throw assignmentError;
      }

      // If kitten is assigned, check if the current user is the owner
      if (assignment) {
        if (currentUserId && assignment.client_id === currentUserId) {
          // User is authenticated and owns this kitten - allow access
          console.log('public-kittens: authenticated user is owner, allowing access', kittenId);
          return new Response(
            JSON.stringify({ kitten }),
            {
              status: 200,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            },
          );
        } else {
          // Kitten is assigned but user is not the owner (or not authenticated) - deny access
          console.log('public-kittens: kitten is assigned to another client, not exposing publicly', kittenId);
          return new Response(
            JSON.stringify({ kitten: null }),
            {
              status: 404,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            },
          );
        }
      }

      // Kitten is not assigned - public access allowed
      return new Response(
        JSON.stringify({ kitten }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // No id provided: return list of available kittens (existing behaviour)
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
      }),
    );

    return new Response(
      JSON.stringify({ kittens: kittensWithPhotos }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
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
      },
    );
  }
});
