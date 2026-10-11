import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "Non autorisé" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Réservé à l'administration" }, 403);

    const { email, password, fullName } = await req.json();
    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      return json({ error: "Email invalide" }, 400);
    if (typeof password !== "string" || password.length < 6 || password.length > 72)
      return json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, 400);

    const { data, error } = await admin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: typeof fullName === "string" ? fullName.slice(0, 200) : "" },
    });
    if (error) {
      const msg = /already/i.test(error.message) ? "Cet email a déjà un compte" : error.message;
      return json({ error: msg }, 400);
    }
    return json({ id: data.user?.id });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
