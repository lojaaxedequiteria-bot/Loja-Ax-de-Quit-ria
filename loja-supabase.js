/* ===== Axé de Quitéria — Loja: Conexão Supabase ===== */
const LJ_SUPABASE_URL  = 'https://rwpcejyumvkwkkvhfrxu.supabase.co';
const LJ_SUPABASE_KEY  = 'sb_publishable_sOlkpgakqADN0Uwkx_PGLQ_gsIim-_k';
// A loja NÃO envia x-aq-secret — só pode SELECT em produtos e INSERT em pedidos
window.LJ_SUPABASE = window.supabase.createClient(LJ_SUPABASE_URL, LJ_SUPABASE_KEY);

/* ── Favoritos — sync via RPCs SECURITY DEFINER ──
   Auth é por email (sistema custom), não Supabase Auth.
   localStorage é o fallback para usuários não logados. */
window.LJ_FAV_SYNC = {
  async getAll(userEmail) {
    if (!window.LJ_SUPABASE || !userEmail) return null;
    const { data, error } = await LJ_SUPABASE.rpc('loja_get_favoritos', { p_email: userEmail });
    if (error) return null;
    /* Map DB columns → app product shape */
    return (data||[]).map(r=>({
      id:       r.produto_id,
      name:     r.nome,
      slug:     r.slug,
      category: r.categoria,
      price:    parseFloat(r.preco||0),
      priceOld: r.preco_antigo ? parseFloat(r.preco_antigo) : null,
      tag:      r.badge||'',
      photo:    r.photo||null,
      fotos:    r.fotos||[],
      orixa:    r.orixa||'',
      destaque: r.destaque||false,
      tone:     '#B0542F',
    }));
  },
  async add(userEmail, produtoId) {
    if (!window.LJ_SUPABASE || !userEmail || !produtoId) return;
    await LJ_SUPABASE.rpc('loja_add_favorito', { p_email: userEmail, p_produto_id: produtoId });
  },
  async remove(userEmail, produtoId) {
    if (!window.LJ_SUPABASE || !userEmail || !produtoId) return;
    await LJ_SUPABASE.rpc('loja_remove_favorito', { p_email: userEmail, p_produto_id: produtoId });
  },
};
