/* ===== Axé de Quitéria — Loja: Listing, Produto, Checkout, Sucesso ===== */

/* ── ListingScreen ── */
function ListingScreen({ products, initialCat, onOpen, onAdd, onHome, isFavorite, onFavorite }) {
  const [cat, setCat] = useState(initialCat||'todos');
  const isLinhaFilter = cat !== 'todos' && !LJ_CATS.find(c => c.id === cat);
  const filtered = products.filter(p => {
    if(cat === 'todos') return true;
    if(isLinhaFilter) return p.orixa === cat;
    return p.category === cat;
  });

  return (
    <main className="lj-listing-main" style={{maxWidth:1200,margin:'0 auto',padding:'40px 24px 24px'}}>
      <div className="lj-listing-header" style={{marginBottom:26}}>
        <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--clay)'}}>A LOJA</span>
        <h1 style={{fontFamily:"'Marcellus',serif",fontSize:40,margin:'8px 0 0',fontWeight:400,color:'var(--ink)'}}>Guias, pulseiras &amp; sagrado</h1>
      </div>

      {/* Filtro por linha (quando vem da seção "Escolha pelo seu orixá") */}
      {isLinhaFilter ? (
        <div className="lj-listing-filter" style={{display:'flex',alignItems:'center',gap:12,marginBottom:26,flexWrap:'wrap'}}>
          <span style={{background:'var(--clay)',color:'#fff',borderRadius:999,padding:'10px 20px',fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:700}}>
            {cat}
          </span>
          <button onClick={()=>setCat('todos')}
            style={{background:'none',border:'1px solid var(--line)',borderRadius:999,padding:'10px 18px',fontFamily:"'Mulish',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer',color:'var(--muted)'}}>
            ✕ Ver todas as peças
          </button>
        </div>
      ) : (
        <div className="lj-listing-chips" style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:26}}>
          {LJ_CATS.map(c=>{
            const active = cat===c.id;
            return (
              <button key={c.id} onClick={()=>setCat(c.id)}
                style={{border:`1px solid ${active?'var(--clay)':'var(--line)'}`,background:active?'var(--clay)':'var(--paper)',color:active?'#fff':'var(--ink)',borderRadius:999,padding:'10px 20px',fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:600,cursor:'pointer',transition:'all .15s',flexShrink:0}}>
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      <p style={{fontSize:13.5,color:'var(--muted)',margin:'0 0 20px'}}>{filtered.length} peças</p>

      {/* Grid */}
      <div className="lj-listing-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:20}}>
        {filtered.map(p=>(
          <ListingCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd}
            isFav={isFavorite?isFavorite(p):false} onFav={onFavorite}/>
        ))}
      </div>
    </main>
  );
}

function ListingCard({ p, onOpen, onAdd, isFav, onFav }) {
  const [h, setH] = useState(false);
  const [hBtn, setHBtn] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{position:'relative'}}>
        <button onClick={()=>onOpen(p)}
          onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
          style={{border:`1px solid ${h?'var(--clay)':'var(--line)'}`,borderRadius:12,overflow:'hidden',background:'var(--paper)',cursor:'pointer',padding:0,position:'relative',display:'block',width:'100%',transition:'border-color .15s'}}>
          {p.photo
            ? <img src={p.photo} alt={p.name} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',display:'block'}}/>
            : <span style={{display:'block',aspectRatio:'1/1',background:'repeating-linear-gradient(135deg,var(--cream-2) 0 13px,var(--cream-3) 13px 26px)'}}/>
          }
          {p.tag && <span style={{position:'absolute',left:11,top:11,fontSize:11,fontWeight:700,color:'#fff',background:p.tone,padding:'4px 9px',borderRadius:999}}>{p.tag}</span>}
        </button>
        {onFav && (
          <button onClick={e=>{e.stopPropagation();onFav(p);}}
            style={{position:'absolute',top:10,right:10,width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.9)',backdropFilter:'blur(4px)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',transition:'transform .15s',zIndex:2}}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.15)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            <HeartIcon filled={isFav}/>
          </button>
        )}
      </div>
      <div style={{padding:'13px 2px 0',display:'flex',flexDirection:'column',flex:1}}>
        <span style={{fontFamily:"'Marcellus',serif",fontSize:19,color:'var(--ink)',lineHeight:1.15}}>{p.name}</span>
        <span style={{fontSize:12.5,color:'var(--muted)',marginTop:3}}>{p.orixa}</span>
        <div style={{marginTop:12,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
          <span style={{fontSize:17,fontWeight:700,color:'var(--ink)'}}>{brl(p.price)}</span>
          <button onClick={e=>{e.stopPropagation();onAdd(p);}}
            onMouseEnter={()=>setHBtn(true)} onMouseLeave={()=>setHBtn(false)}
            style={{background:hBtn?'var(--clay)':'var(--ink)',color:'var(--cream)',border:'none',borderRadius:999,padding:'9px 16px',fontFamily:"'Mulish',sans-serif",fontSize:13,fontWeight:700,cursor:'pointer',transition:'background .15s',whiteSpace:'nowrap'}}>
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ProductScreen ── */
function ProductScreen({ product, onBack, onAdd, onBuy, isFavorite, onFavorite, products }) {
  const p = product;
  const [qty, setQty] = useState(1);
  const allPhotos = [p.photo, ...(p.fotos||[])].filter(Boolean);
  const [activePhoto, setActivePhoto] = useState(allPhotos[0]||null);
  const related = (products||[]).filter(x=>x.id!==p.id&&x.category===p.category).slice(0,4);
  const notes = ['Peça artesanal — variações mínimas fazem parte da identidade','Envio em até 3 dias úteis após confirmação','Frete via Correios PAC · Retirada em Porto Alegre'];

  return (
    <main className="lj-prod-content-pad" style={{maxWidth:1200,margin:'0 auto',padding:'28px 24px 24px'}}>
      <button onClick={onBack} className="lj-prod-back"
        style={{background:'none',border:'none',color:'var(--muted)',fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:22,padding:0}}>
        ← Voltar para a loja
      </button>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:52,alignItems:'start'}} className="product-grid">

        {/* Imagem */}
        <div>
          <div style={{position:'relative'}}>
            <div className="lj-prod-image-wrap" style={{aspectRatio:'1/1',borderRadius:14,background:'repeating-linear-gradient(135deg,var(--cream-2) 0 15px,var(--cream-3) 15px 30px)',border:'1px solid var(--line)',position:'relative',overflow:'hidden'}}>
              {activePhoto
                ? <img src={activePhoto} alt={p.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
                : null
              }
              <span style={{position:'absolute',left:16,top:16,fontSize:12,fontWeight:700,color:'#fff',background:p.tone,padding:'5px 12px',borderRadius:999,zIndex:1}}>{p.tag}</span>
              {!activePhoto && <span style={{position:'absolute',bottom:18,left:18,fontFamily:'ui-monospace,Menlo,monospace',fontSize:11,color:'var(--clay-deep)',background:'rgba(251,246,238,.85)',padding:'6px 10px',borderRadius:6}}>{p.orixa}</span>}
            </div>
            {/* Coração sobreposto — visível apenas no mobile */}
            {onFavorite && (
              <button onClick={()=>onFavorite(p)} className="lj-prod-img-fav"
                aria-label={isFavorite?'Remover dos favoritos':'Salvar nos favoritos'}>
                <HeartIcon filled={isFavorite}/>
              </button>
            )}
          </div>
          {/* Galeria de thumbnails */}
          {allPhotos.length > 0 && (
            <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(allPhotos.length,5)},1fr)`,gap:10,marginTop:10}}>
              {allPhotos.map((url,i)=>(
                <button key={i} onClick={()=>setActivePhoto(url)}
                  style={{aspectRatio:'1/1',borderRadius:8,background:'repeating-linear-gradient(135deg,var(--cream-2) 0 8px,var(--cream-3) 8px 16px)',border:`2px solid ${activePhoto===url?'var(--clay)':'var(--line)'}`,cursor:'pointer',overflow:'hidden',padding:0,transition:'border-color .15s'}}>
                  <img src={url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lj-prod-info">
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.2em',color:'var(--clay)'}}>{p.orixa}</span>
          <h1 style={{fontFamily:"'Marcellus',serif",fontSize:42,lineHeight:1.06,margin:'12px 0 16px',fontWeight:400,color:'var(--ink)'}}>{p.name}</h1>
          <p style={{fontSize:24,fontWeight:700,color:'var(--ink)',margin:'0 0 8px'}}>{brl(p.price)}</p>
          <p style={{fontSize:13.5,color:'var(--muted)',margin:'0 0 24px'}}>em até 3x sem juros · à vista no Pix</p>
          <p style={{fontSize:16,lineHeight:1.7,color:'var(--muted)',margin:'0 0 26px'}}>{p.desc}</p>
          {p.bullets && (
            <ul style={{listStyle:'none',padding:0,margin:'0 0 30px',display:'flex',flexDirection:'column',gap:11}}>
              {p.bullets.map((b,i)=>(
                <li key={i} style={{display:'flex',alignItems:'center',gap:11,fontSize:15,color:'var(--ink)'}}>
                  <span style={{width:7,height:7,background:'var(--gold)',borderRadius:'50%',flexShrink:0,display:'block'}}/>
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Qty + Adicionar + Favorito (desktop / hidden on mobile) */}
          <div className="lj-prod-desktop-cta" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line)',borderRadius:999,overflow:'hidden'}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:'none',border:'none',width:44,height:48,fontSize:20,cursor:'pointer',color:'var(--ink)'}}>−</button>
              <span style={{width:34,textAlign:'center',fontSize:16,fontWeight:700}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{background:'none',border:'none',width:44,height:48,fontSize:20,cursor:'pointer',color:'var(--ink)'}}>+</button>
            </div>
            <button onClick={()=>{ for(let i=0;i<qty;i++) onAdd(p); }}
              style={{flex:1,minWidth:160,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'16px 30px',fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Adicionar ao carrinho
            </button>
            {onFavorite && (
              <button onClick={()=>onFavorite(p)}
                title={isFavorite?'Remover dos favoritos':'Salvar nos favoritos'}
                style={{width:52,height:52,borderRadius:'50%',border:`1.5px solid ${isFavorite?'#C4553B':'var(--line)'}`,background:isFavorite?'rgba(196,85,59,.08)':'var(--paper)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .15s'}}>
                <HeartIcon filled={isFavorite}/>
              </button>
            )}
          </div>

          {/* Notes */}
          <div style={{marginTop:24,paddingTop:22,borderTop:'1px solid var(--line)',display:'flex',flexDirection:'column',gap:9}}>
            {notes.map(n=>(
              <span key={n} style={{fontSize:13.5,color:'var(--muted)'}}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA fixo mobile (oculto no desktop via CSS) */}
      <div className="lj-prod-cta-fixed">
        <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line)',borderRadius:999,overflow:'hidden',flexShrink:0}}>
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:'none',border:'none',width:38,height:42,fontSize:18,cursor:'pointer',color:'var(--ink)'}}>−</button>
          <span style={{width:28,textAlign:'center',fontSize:15,fontWeight:700}}>{qty}</span>
          <button onClick={()=>setQty(q=>q+1)} style={{background:'none',border:'none',width:38,height:42,fontSize:18,cursor:'pointer',color:'var(--ink)'}}>+</button>
        </div>
        <button onClick={()=>{ for(let i=0;i<qty;i++) onAdd(p); }}
          style={{flex:1,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'14px 20px',fontFamily:"'Mulish',sans-serif",fontSize:15,fontWeight:700,cursor:'pointer'}}>
          Adicionar ao carrinho
        </button>
        {onFavorite && (
          <button onClick={()=>onFavorite(p)}
            style={{width:46,height:46,borderRadius:'50%',border:`1.5px solid ${isFavorite?'#C4553B':'var(--line)'}`,background:isFavorite?'rgba(196,85,59,.08)':'var(--paper)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <HeartIcon filled={isFavorite}/>
          </button>
        )}
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section style={{marginTop:72}}>
          <h2 style={{fontFamily:"'Marcellus',serif",fontSize:28,margin:'0 0 24px',fontWeight:400,color:'var(--ink)'}}>Você também pode gostar</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:20}}>
            {related.map(rp=>(
              <div key={rp.id} style={{display:'flex',flexDirection:'column'}}>
                <button onClick={()=>onBuy(rp)} style={{border:'1px solid var(--line)',borderRadius:12,overflow:'hidden',background:'var(--paper)',cursor:'pointer',padding:0,position:'relative',display:'block'}}>
                  {rp.photo
                    ? <img src={rp.photo} alt={rp.name} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',display:'block'}}/>
                    : <span style={{display:'block',aspectRatio:'1/1',background:'repeating-linear-gradient(135deg,var(--cream-2) 0 13px,var(--cream-3) 13px 26px)'}}/>
                  }
                  <span style={{position:'absolute',left:11,top:11,fontSize:11,fontWeight:700,color:'#fff',background:rp.tone,padding:'4px 9px',borderRadius:999}}>{rp.tag}</span>
                </button>
                <div style={{padding:'13px 2px 0'}}>
                  <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)'}}>{rp.name}</span>
                  <span style={{display:'block',fontSize:16,fontWeight:700,color:'var(--ink)',marginTop:8}}>{brl(rp.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* ── CheckoutScreen ── */
function CheckoutScreen({ cart, onBack, onSuccess, user }) {
  const firstAddr = user?.enderecos?.[0];
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    fone: user?.telefone || '',
    cep: firstAddr?.cep || '',
    cidadeuf: firstAddr?.cidadeuf || (firstAddr?.cidade ? `${firstAddr.cidade}${firstAddr.uf?' / '+firstAddr.uf:''}` : ''),
    endereco: firstAddr?.endereco || '',
  });
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [pagamento, setPagamento] = useState('pix');
  const [freteId, setFreteId] = useState('correios');
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(user?.enderecos?.length > 0 ? 0 : -1);

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const freteObj = LJ_SHIPPING.find(s => s.id === freteId) || LJ_SHIPPING[0];
  const frete = freteObj.value;

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const descPix = pagamento === 'pix' ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const total = subtotal + frete - descPix;

  const PAGAMENTOS = [
    { id: 'pix',    label: 'Pix', sub: '5% de desconto · pagamento instantâneo' },
    { id: 'cartao', label: 'Cartão de crédito', sub: 'Em até 3× sem juros' },
    { id: 'boleto', label: 'Boleto bancário', sub: 'Vencimento em 3 dias úteis' },
  ];

  const buscarCep = async (cep) => {
    const c = cep.replace(/\D/g, '');
    if (c.length !== 8) return;
    try {
      setCepLoading(true);
      const r = await fetch(`https://viacep.com.br/ws/${c}/json/`);
      const d = await r.json();
      if (!d.erro) {
        up('endereco', `${d.logradouro}${d.bairro ? ', ' + d.bairro : ''}`);
        up('cidadeuf', `${d.localidade} / ${d.uf}`);
      }
    } catch(e) {}
    finally { setCepLoading(false); }
  };

  const finalizar = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    const numero = `AQ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*9000+1000)}`;

    const pedido = {
      id: numero,
      numero,
      cliente: {
        nome: form.nome,
        email: form.email,
        tel: form.fone,
        endereco: `${form.endereco}, ${form.cidadeuf} — CEP ${form.cep}`,
      },
      itens: cart.map(it => ({ id: it.id, nome: it.name, qty: it.qty, preco: it.price, tone: it.tone })),
      frete: { id: freteObj.id, label: freteObj.label, valor: freteObj.value, prazo: freteObj.prazo },
      pagamento,
      total,
      status: 'recebido',
      origem: 'loja',
    };

    try {
      await LJ_SUPABASE.from('pedidos').insert(pedido);
    } catch(_) {}

    try {
      const o = { id: numero, itens: cart, total, status: 'recebido', data: new Date().toLocaleDateString('pt-BR') };
      const prev = JSON.parse(localStorage.getItem(LJ_ORDERS_KEY) || '[]');
      localStorage.setItem(LJ_ORDERS_KEY, JSON.stringify([o, ...prev]));
    } catch(_) {}

    setLoading(false);
    onSuccess(numero);
  };

  return (
    <main style={{maxWidth:1000,margin:'0 auto',padding:'40px 24px 24px'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:'var(--muted)',fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:20,padding:0}}>
        ← Voltar ao carrinho
      </button>
      <h1 style={{fontFamily:"'Marcellus',serif",fontSize:38,margin:'0 0 30px',fontWeight:400,color:'var(--ink)'}}>Finalizar pedido</h1>
      <form onSubmit={finalizar}>
        <div style={{display:'grid',gridTemplateColumns:'1.3fr .9fr',gap:40,alignItems:'start'}} className="checkout-grid">

          {/* Form */}
          <div style={{display:'flex',flexDirection:'column',gap:26}}>

            {/* Contato */}
            <div>
              <h3 style={{fontFamily:"'Marcellus',serif",fontSize:20,margin:'0 0 14px',fontWeight:400}}>Contato</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <input className="lj-input" placeholder="Nome completo" style={{gridColumn:'1/-1'}} value={form.nome} onChange={e=>up('nome',e.target.value)} required/>
                <input className="lj-input" placeholder="E-mail" type="email" value={form.email} onChange={e=>up('email',e.target.value)} required/>
                <input className="lj-input" placeholder="WhatsApp" type="tel" value={form.fone} onChange={e=>up('fone',e.target.value)} required/>
              </div>
            </div>

            {/* Entrega */}
            <div>
              <h3 style={{fontFamily:"'Marcellus',serif",fontSize:20,margin:'0 0 14px',fontWeight:400}}>Entrega</h3>

              {/* Endereços salvos */}
              {user?.enderecos?.length > 0 && (
                <div style={{marginBottom:16}}>
                  <p style={{fontSize:13,color:'var(--muted)',margin:'0 0 10px'}}>Seus endereços cadastrados:</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {user.enderecos.map((a,i)=>(
                      <button key={i} type="button"
                        onClick={() => {
                          setSelectedAddrIdx(i);
                          up('endereco', a.endereco || '');
                          up('cidadeuf', a.cidadeuf || (a.cidade ? `${a.cidade}${a.uf ? ' / '+a.uf : ''}` : ''));
                          up('cep', a.cep || '');
                        }}
                        style={{textAlign:'left',border:`1px solid ${selectedAddrIdx===i?'var(--clay)':'var(--line)'}`,background:selectedAddrIdx===i?'rgba(176,84,47,.06)':'var(--paper)',borderRadius:10,padding:'12px 14px',cursor:'pointer',fontSize:14}}>
                        <span style={{fontWeight:700,color:'var(--ink)'}}>{a.label || `Endereço ${i+1}`}</span><br/>
                        <span style={{color:'var(--muted)'}}>{a.endereco}{a.cidadeuf ? ' — '+a.cidadeuf : ''}</span>
                      </button>
                    ))}
                    <button type="button" onClick={()=>setSelectedAddrIdx(-1)}
                      style={{background:'none',border:'none',color:'var(--clay)',fontSize:13,fontWeight:700,cursor:'pointer',textAlign:'left',padding:'4px 0'}}>
                      + Usar outro endereço
                    </button>
                  </div>
                </div>
              )}

              {/* Campos de endereço */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div style={{position:'relative'}}>
                  <input className="lj-input" placeholder="CEP" value={form.cep}
                    onChange={e=>up('cep',e.target.value)}
                    onBlur={e=>buscarCep(e.target.value)} required/>
                  {cepLoading && <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',fontSize:12,color:'var(--muted)'}}>buscando…</span>}
                </div>
                <input className="lj-input" placeholder="Cidade / UF" value={form.cidadeuf} onChange={e=>up('cidadeuf',e.target.value)} required/>
                <input className="lj-input" placeholder="Endereço e número" style={{gridColumn:'1/-1'}} value={form.endereco} onChange={e=>up('endereco',e.target.value)} required/>
              </div>
            </div>

            {/* Frete */}
            <div>
              <h3 style={{fontFamily:"'Marcellus',serif",fontSize:20,margin:'0 0 14px',fontWeight:400}}>Frete</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {LJ_SHIPPING.map(s=>(
                  <label key={s.id}
                    onClick={()=>setFreteId(s.id)}
                    style={{display:'flex',alignItems:'center',gap:12,border:`1px solid ${freteId===s.id?'var(--clay)':'var(--line)'}`,background:freteId===s.id?'rgba(176,84,47,.06)':'var(--paper)',borderRadius:10,padding:'12px 14px',cursor:'pointer',transition:'all .15s'}}>
                    <span style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${freteId===s.id?'var(--clay)':'var(--line)'}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {freteId===s.id && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--clay)',display:'block'}}/>}
                    </span>
                    <span>
                      <span style={{display:'block',fontSize:14,fontWeight:700,color:'var(--ink)'}}>{s.label}</span>
                      <span style={{display:'block',fontSize:12,color:'var(--muted)',marginTop:2}}>{s.prazo} · {s.value===0?'Grátis':brl(s.value)}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <h3 style={{fontFamily:"'Marcellus',serif",fontSize:20,margin:'0 0 14px',fontWeight:400}}>Pagamento</h3>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {PAGAMENTOS.map(pm=>(
                  <label key={pm.id}
                    onClick={()=>setPagamento(pm.id)}
                    style={{display:'flex',alignItems:'center',gap:14,border:`1px solid ${pagamento===pm.id?'var(--clay)':'var(--line)'}`,background:pagamento===pm.id?'rgba(176,84,47,.06)':'var(--paper)',borderRadius:10,padding:'14px 16px',cursor:'pointer',transition:'all .15s'}}>
                    <span style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${pagamento===pm.id?'var(--clay)':'var(--line)'}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {pagamento===pm.id && <span style={{width:8,height:8,borderRadius:'50%',background:'var(--clay)',display:'block'}}/>}
                    </span>
                    <span>
                      <span style={{display:'block',fontSize:15,fontWeight:700,color:'var(--ink)'}}>{pm.label}</span>
                      <span style={{display:'block',fontSize:12.5,color:'var(--muted)',marginTop:2}}>{pm.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Aside */}
          <aside className="checkout-aside" style={{border:'1px solid var(--line)',borderRadius:14,padding:24,background:'var(--paper)',position:'sticky',top:100}}>
            <h3 style={{fontFamily:"'Marcellus',serif",fontSize:20,margin:'0 0 16px',fontWeight:400}}>Seu pedido</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:18}}>
              {cart.map(it=>(
                <div key={it.id} style={{display:'flex',justifyContent:'space-between',gap:12,fontSize:14}}>
                  <span style={{color:'var(--ink)'}}>{it.qty}× {it.name}</span>
                  <span style={{fontWeight:700,whiteSpace:'nowrap'}}>{brl(it.price*it.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{borderTop:'1px solid var(--line)',paddingTop:14,display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)'}}>
                <span>Subtotal</span><span>{brl(subtotal)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--muted)'}}>
                <span>Frete</span><span>{frete===0?'Grátis':brl(frete)}</span>
              </div>
              {descPix > 0 && (
                <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#2F7D5E'}}>
                  <span>Desconto Pix (5%)</span><span>-{brl(descPix)}</span>
                </div>
              )}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'Marcellus',serif",fontSize:24,marginTop:12,color:'var(--ink)'}}>
              <span>Total</span><span>{brl(total)}</span>
            </div>
            <button type="submit" disabled={loading||cart.length===0}
              style={{width:'100%',marginTop:20,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:16,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
              {loading ? 'Processando…' : 'Confirmar pedido'}
            </button>
            <p style={{fontSize:12,color:'var(--muted)',textAlign:'center',margin:'12px 0 0'}}>Pagamento seguro · Pix, cartão ou boleto</p>
          </aside>
        </div>
      </form>
    </main>
  );
}

/* ── SuccessScreen ── */
function SuccessScreen({ onHome, onListing, orderNum }) {
  return (
    <div style={{maxWidth:560,margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
      <div style={{width:80,height:80,borderRadius:'50%',background:'var(--clay)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 28px'}}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      {orderNum && (
        <p style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.2em',color:'var(--clay)',margin:'0 0 10px'}}>
          PEDIDO {orderNum}
        </p>
      )}
      <h1 style={{fontFamily:"'Marcellus',serif",fontSize:32,fontWeight:400,color:'var(--ink)',marginBottom:16}}>Pedido recebido!</h1>
      <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.7,marginBottom:36}}>
        Seu pedido foi registrado com sucesso. Nossa equipe vai analisar e entrar em contato para confirmar o pagamento e a entrega. Axé! 🌿
      </p>
      <p style={{fontSize:14,color:'var(--muted)',marginBottom:28}}>
        Acompanhe o status em <strong>Minha conta → Meus pedidos</strong>
      </p>
      <div style={{display:'flex',flexWrap:'wrap',gap:14,justifyContent:'center'}}>
        <BtnClay onClick={onHome}>Voltar à home</BtnClay>
        <BtnOutline onClick={onListing}>Continuar comprando</BtnOutline>
      </div>
    </div>
  );
}

Object.assign(window, { ListingScreen, ProductScreen, CheckoutScreen, SuccessScreen });
