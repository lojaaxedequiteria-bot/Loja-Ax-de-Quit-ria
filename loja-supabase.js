/* ===== Axé de Quitéria — Loja: Conexão Supabase ===== */
const LJ_SUPABASE_URL  = 'https://pebaphgqdguexsalgvrp.supabase.co';
const LJ_SUPABASE_KEY  = 'sb_publishable__GBZqDy_TXsA8wGeBuXf2A__12w2fx7';
// A loja NÃO envia x-aq-secret — só pode fazer SELECT em produtos e INSERT em pedidos
window.LJ_SUPABASE = window.supabase.createClient(LJ_SUPABASE_URL, LJ_SUPABASE_KEY);
