/* ===== Axé de Quitéria — Loja: Home Screen ===== */

function HomeScreen({ products, onListing, onOpen, onAdd, onSobre, onContato, isFavorite, onFavorite }) {
  const destaque = (products&&products.length?products:LJ_PRODUCTS).filter(p => p.destaque).slice(0, 8);
  const [heroPhoto, setHeroPhoto] = useState(null);
  const linesScrollRef = useRef(null);

  const TRUST_ITEMS = ['Firmadas à mão, uma a uma','Envio para todo o Brasil','Pix, cartão ou boleto','Troca em até 7 dias'];

  useEffect(()=>{
    if(!window.LJ_SUPABASE) return;
    LJ_SUPABASE.from('config_loja').select('valor').eq('key','hero_photo').maybeSingle()
      .then(({data})=>{ if(data?.valor) setHeroPhoto(data.valor); });
  },[]);

  /* Auto-scroll dos círculos de linha */
  useEffect(()=>{
    const el = linesScrollRef.current;
    if (!el) return;
    const id = setInterval(()=>{
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 82, behavior: 'smooth' });
      }
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const scrollLines = (dir) => linesScrollRef.current?.scrollBy({ left: dir * 82, behavior: 'smooth' });

  return (
    <div>

      {/* ── Mobile Hero (oculto no desktop via CSS) ── */}
      <div className="lj-m-hero">
        <div className="lj-m-hero-card">
          <div className="lj-m-hero-img">
            {heroPhoto && <img src={heroPhoto} alt="Axé de Quitéria"/>}
            {!heroPhoto && (
              <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:11,color:'var(--clay-deep)',background:'rgba(251,246,238,.85)',padding:'6px 10px',borderRadius:6,position:'relative',zIndex:1}}>
                adicione a foto no app de gestão
              </span>
            )}
          </div>
          <div className="lj-m-hero-text">
            <span className="lj-m-hero-eyebrow">FEITO COM AXÉ · PORTO ALEGRE</span>
            <h1 className="lj-m-hero-title">O sagrado firmado à mão, conta por conta</h1>
            <button className="lj-m-hero-cta" onClick={()=>onListing()}>Comprar agora</button>
          </div>
        </div>
      </div>

      {/* ── Hero (desktop) ── */}
      <section style={{maxWidth:1200,margin:'0 auto',padding:'56px 24px 40px',display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:48,alignItems:'center'}} className="hero-grid">
        <div>
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.24em',color:'var(--clay)'}}>FEITO COM AXÉ · PORTO ALEGRE</span>
          <h1 style={{fontFamily:"'Marcellus',serif",fontSize:'clamp(40px,5vw,60px)',lineHeight:1.02,margin:'18px 0 20px',color:'var(--ink)',fontWeight:400,textWrap:'balance'}}>
            Guias e pulseiras feitas à mão, com fé e cuidado
          </h1>
          <p style={{fontSize:17,lineHeight:1.65,color:'var(--muted)',maxWidth:440,margin:'0 0 30px'}}>
            Cada peça é contada, montada e firmada uma a uma, respeitando a linha de cada orixá. Proteção que se veste no corpo e se carrega na alma.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <BtnClay onClick={onListing}>Ver a loja</BtnClay>
            <BtnOutline onClick={onSobre}>Conheça o Ateliê</BtnOutline>
          </div>
        </div>
        <div className="hero-img" style={{aspectRatio:'4/5',borderRadius:14,overflow:'hidden',background:'repeating-linear-gradient(135deg,var(--cream-2) 0 16px,var(--cream-3) 16px 32px)',border:'1px solid var(--line)',position:'relative',display:'flex',alignItems:'flex-end',padding:18}}>
          {heroPhoto && (
            <img src={heroPhoto} alt="Axé de Quitéria" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
          )}
          {!heroPhoto && (
            <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:11,color:'var(--clay-deep)',background:'rgba(251,246,238,.85)',padding:'6px 10px',borderRadius:6,position:'relative'}}>
              adicione a foto no app de gestão → Vitrine
            </span>
          )}
        </div>
      </section>

      {/* ── Trust Strip (desktop) ── */}
      <section className="lj-trust-desktop" style={{borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)',background:'var(--paper)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'20px 24px',display:'flex',flexWrap:'wrap',gap:12,justifyContent:'space-between'}}>
          {['Firmadas à mão, uma a uma','Envio para todo o Brasil','Pix, cartão ou boleto','Troca em até 7 dias'].map(t=>(
            <span key={t} style={{display:'flex',alignItems:'center',gap:9,fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>
              <span style={{width:7,height:7,background:'var(--gold)',borderRadius:'50%',flexShrink:0,display:'block'}}/>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Mobile Trust Strip (ticker automático) ── */}
      <div className="lj-m-trust">
        <div className="lj-m-trust-track">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((t,i)=>(
            <span key={i} className="lj-m-trust-pill">
              <span className="lj-m-trust-dot"/>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categorias por linha (desktop) ── */}
      <section className="lj-lines-desktop" style={{maxWidth:1200,margin:'0 auto',padding:'64px 24px 24px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,marginBottom:28}}>
          <div>
            <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--clay)'}}>POR LINHA</span>
            <h2 style={{fontFamily:"'Marcellus',serif",fontSize:34,margin:'8px 0 0',fontWeight:400,color:'var(--ink)'}}>Escolha pela sua linha</h2>
          </div>
          <button onClick={onListing} style={{background:'none',border:'none',color:'var(--clay)',fontWeight:700,fontSize:14,cursor:'pointer',whiteSpace:'nowrap'}}>Ver todas →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:16}}>
          {LJ_CAT_CARDS.map((c,i)=>(
            <HomeCatCard key={i} card={c} onClick={()=>onListing(c.id)}/>
          ))}
        </div>
      </section>

      {/* ── Mobile: Escolha pela sua linha (círculos + auto-scroll + setas) ── */}
      <div className="lj-m-lines">
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:'16px 16px 10px'}}>
          <h2 style={{fontFamily:"'Marcellus',serif",fontSize:22,margin:0,fontWeight:400,color:'var(--ink)'}}>Escolha pela sua linha</h2>
          <button onClick={()=>onListing()} style={{background:'none',border:'none',color:'var(--clay)',fontWeight:700,fontSize:13,cursor:'pointer',whiteSpace:'nowrap'}}>Ver todas →</button>
        </div>
        <div style={{position:'relative'}}>
          <button className="lj-m-lines-arrow lj-m-lines-arrow-l" onClick={()=>scrollLines(-1)} aria-label="Anterior">‹</button>
          <div className="lj-m-lines-scroll" ref={linesScrollRef}>
            {LJ_CAT_CARDS.map((c,i)=>(
              <button key={i} className="lj-m-line-item" onClick={()=>onListing(c.id)}>
                <div className="lj-m-line-circle" style={{background:c.tone}}>
                  <span style={{fontSize:17,fontWeight:700,color:'rgba(255,255,255,.9)',lineHeight:1}}>{c.name.charAt(0)}</span>
                </div>
                <span className="lj-m-line-label">{c.name}</span>
              </button>
            ))}
          </div>
          <button className="lj-m-lines-arrow lj-m-lines-arrow-r" onClick={()=>scrollLines(1)} aria-label="Próximo">›</button>
        </div>
      </div>

      {/* ── Destaques ── */}
      <section style={{maxWidth:1200,margin:'0 auto',padding:'48px 24px 24px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,marginBottom:28}}>
          <div>
            <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--clay)'}}>SELEÇÃO DA CASA</span>
            <h2 style={{fontFamily:"'Marcellus',serif",fontSize:34,margin:'8px 0 0',fontWeight:400,color:'var(--ink)'}}>Destaques</h2>
          </div>
          <button onClick={onListing} style={{background:'none',border:'none',color:'var(--clay)',fontWeight:700,fontSize:14,cursor:'pointer',whiteSpace:'nowrap'}}>Ver tudo →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:20}}>
          {destaque.map(p=>(
            <HomeProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd}
              isFav={isFavorite?isFavorite(p):false} onFav={onFavorite}/>
          ))}
        </div>
      </section>

      {/* ── Sobre ── */}
      <div id="sobre">

        {/* Desktop */}
        <section className="lj-sobre-desktop" style={{background:'var(--clay)',color:'var(--cream)',marginTop:64}}>
          <div style={{maxWidth:1200,margin:'0 auto',padding:'72px 24px',display:'grid',gridTemplateColumns:'.9fr 1.1fr',gap:52,alignItems:'center'}} className="sobre-grid">
            <div style={{aspectRatio:'4/5',borderRadius:14,overflow:'hidden',border:'1px solid rgba(255,255,255,.25)'}}>
              <img src="assets/sobre-laura.jpg" alt="Laura — Axé de Quitéria" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </div>
            <div>
              <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--gold-soft)'}}>A HISTÓRIA</span>
              <h2 style={{fontFamily:"'Marcellus',serif",fontSize:'clamp(28px,3vw,40px)',lineHeight:1.1,margin:'14px 0 20px',fontWeight:400}}>Conheça quem está por trás do ateliê</h2>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
                Muito prazer, eu sou a Laura.
              </p>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
                O Ateliê Axé de Quitéria nasceu da minha fé, da minha conexão com a espiritualidade e do desejo de transformar cada peça em um símbolo de proteção, devoção e axé.
              </p>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
                Sua criação foi uma orientação da minha Pombagira, Dona Quitéria, e dar ao ateliê o seu nome é a forma que encontrei de honrar sua presença e o axé que inspira este trabalho.
              </p>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
                Cada guia, pulseira e fio é confeccionado artesanalmente, com respeito aos fundamentos, atenção aos detalhes e muito carinho, para que você receba uma peça feita com propósito, qualidade e significado.
              </p>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
                Ficarei muito feliz em fazer parte da sua caminhada espiritual. Se tiver dúvidas ou quiser uma peça personalizada, será um prazer conversar com você e ajudá-lo(a) a encontrar a guia ideal.
              </p>
              <p style={{fontSize:16,lineHeight:1.7,margin:'0 0 22px',color:'rgba(245,237,225,.9)'}}>
                Seja muito bem-vindo(a) ao Ateliê Axé de Quitéria. Que nunca lhe faltem fé, proteção e muito axé! 🌿
              </p>
              <button onClick={onContato} style={{background:'var(--cream)',color:'var(--clay-deep)',border:'none',borderRadius:999,padding:'14px 28px',fontFamily:"'Mulish',sans-serif",fontSize:15,fontWeight:700,cursor:'pointer'}}>
                Falar com a loja
              </button>
            </div>
          </div>
        </section>

        {/* Mobile */}
        <section className="lj-m-sobre" style={{background:'var(--clay)',color:'var(--cream)',marginTop:32}}>
          <div style={{aspectRatio:'4/3',overflow:'hidden'}}>
            <img src="assets/sobre-laura.jpg" alt="Laura — Axé de Quitéria" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          </div>
          <div style={{padding:'28px 20px 32px'}}>
            <span style={{fontFamily:"'Marcellus SC',serif",fontSize:10,letterSpacing:'.22em',color:'var(--gold-soft)'}}>A HISTÓRIA</span>
            <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,lineHeight:1.12,margin:'10px 0 18px',fontWeight:400}}>Conheça quem está por trás do ateliê</h2>
            <p style={{fontSize:15,lineHeight:1.75,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
              Muito prazer, eu sou a Laura! 🌿
            </p>
            <p style={{fontSize:15,lineHeight:1.75,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
              O Ateliê Axé de Quitéria nasceu da minha fé e de uma orientação direta da minha Pombagira, Dona Quitéria, que inspirou o nome e todo o propósito deste projeto.
            </p>
            <p style={{fontSize:15,lineHeight:1.75,margin:'0 0 14px',color:'rgba(245,237,225,.9)'}}>
              Meu trabalho é confeccionar de forma totalmente artesanal as guias, pulseiras e fios. Faço tudo com muito respeito aos fundamentos, atenção aos detalhes e carinho, para que você receba um verdadeiro símbolo de proteção e devoção.
            </p>
            <p style={{fontSize:15,lineHeight:1.75,margin:'0 0 24px',color:'rgba(245,237,225,.9)'}}>
              Estou aqui para fazer parte da sua caminhada espiritual! Se precisar de uma peça personalizada ou tiver alguma dúvida, será um prazer conversar com você. Seja muito bem-vindo(a) e que nunca lhe falte axé!
            </p>
            <a href={`https://wa.me/${LJ_STORE.whatsapp}`}
              style={{display:'inline-flex',alignItems:'center',gap:10,background:'#1FA855',color:'#fff',textDecoration:'none',borderRadius:999,padding:'13px 22px',fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:700}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 0 16 8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 0 1 12 4z"/></svg>
              Chamar no WhatsApp
            </a>
          </div>
        </section>

      </div>

      {/* ── Contato ── */}
      <section id="contato" style={{maxWidth:1200,margin:'0 auto',padding:'72px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:44,alignItems:'center'}} className="contact-grid">
          <div>
            <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--clay)'}}>ONDE ESTAMOS</span>
            <h2 style={{fontFamily:"'Marcellus',serif",fontSize:34,margin:'10px 0 18px',fontWeight:400,color:'var(--ink)'}}>Porto Alegre · RS</h2>
            <p style={{fontSize:16,lineHeight:1.7,color:'var(--muted)',margin:'0 0 22px'}}>
              Atendimento com hora marcada e envio para todo o Brasil. Fale com a gente pelo WhatsApp para encomendas e peças personalizadas por linha.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                'Segunda a sábado, das 08h às 17h',
                'Rua Prof. Antônio D\'Ávila, Sétimo Céu — Porto Alegre/RS',
                'atendimento@lojaaxédequitéria.com.br',
              ].map(c=>(
                <span key={c} style={{display:'flex',alignItems:'center',gap:11,fontSize:15,color:'var(--ink)'}}>
                  <span style={{width:9,height:9,borderRadius:'50%',background:'var(--clay)',flexShrink:0,display:'block'}}/>
                  {c}
                </span>
              ))}
            </div>
            <a href={`https://wa.me/${LJ_STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:10,marginTop:26,background:'#1FA855',color:'#fff',textDecoration:'none',borderRadius:999,padding:'14px 26px',fontSize:15,fontWeight:700}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 0 16 8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 0 1 12 4z"/></svg>
              Chamar no WhatsApp
            </a>
          </div>
          <div style={{aspectRatio:'4/3',borderRadius:14,overflow:'hidden',border:'1px solid var(--line)'}}>
            <iframe
              title="Localização Axé de Quitéria"
              src="https://maps.google.com/maps?q=Rua+Professor+Ant%C3%B4nio+D%27%C3%81vila,+S%C3%A9timo+C%C3%A9u,+Porto+Alegre,+RS,+91920-730&t=&z=16&ie=UTF8&iwloc=&output=embed"
              style={{width:'100%',height:'100%',border:0,display:'block'}}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <AppFooter onListing={onListing} onHome={onListing}/>
    </div>
  );
}

/* Card de categoria compacto */
function HomeCatCard({ card, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{textAlign:'left',border:`1px solid ${h?'var(--clay)':'var(--line)'}`,borderRadius:12,overflow:'hidden',background:'var(--paper)',cursor:'pointer',padding:0,transition:'border-color .15s',display:'block',width:'100%'}}>
      <span style={{display:'block',height:80,background:card.tone,position:'relative',opacity:.88}}>
        <span style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.08) 0%,rgba(0,0,0,.18) 100%)'}}/>
      </span>
      <span style={{display:'block',padding:'13px 15px 16px'}}>
        <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)'}}>{card.name}</span>
        <span style={{display:'block',fontSize:12.5,color:'var(--muted)',marginTop:3}}>{card.sub}</span>
      </span>
    </button>
  );
}

/* Card de produto da home */
function HomeProductCard({ p, onOpen, onAdd, isFav, onFav }) {
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
          {p.tag && <span style={{position:'absolute',left:11,top:11,fontSize:11,fontWeight:700,color:'#fff',background:p.tone,padding:'4px 9px',borderRadius:999,letterSpacing:'.02em'}}>{p.tag}</span>}
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

window.HomeScreen = HomeScreen;
