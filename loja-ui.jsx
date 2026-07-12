/* ===== Axé de Quitéria — Loja: UI Compartilhado ===== */
/* Expose hooks globally so all subsequent babel scripts can use them without re-importing */
const { useState, useEffect, useRef, useMemo, useCallback } = React;
Object.assign(window, { useState, useEffect, useRef, useMemo, useCallback });

/* ---------- Icons ---------- */
function Icon({ name, size = 20, color }) {
  const s = { width:size, height:size, flexShrink:0, display:'block', ...(color?{color}:{}) };
  if (name==='person')  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/></svg>;
  if (name==='bag')     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>;
  if (name==='close')   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  if (name==='chevR')   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 18 15 12 9 6"/></svg>;
  if (name==='chevL')   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="15 18 9 12 15 6"/></svg>;
  if (name==='heart')   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
  if (name==='heart-f') return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
  if (name==='logout')  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/></svg>;
  if (name==='box')     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
  if (name==='lock')    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  if (name==='wa')      return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 0 16 8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 0 1 12 4z"/></svg>;
  if (name==='check')   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>;
  if (name==='mail')    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
  if (name==='map')     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
  return null;
}

/* ---------- Placeholder striped ---------- */
function Ph({ style }) {
  return <span style={{ display:'block', background:'repeating-linear-gradient(135deg,var(--cream-2) 0 13px,var(--cream-3) 13px 26px)', ...style }}/>;
}

/* ---------- Buttons ---------- */
function BtnClay({ onClick, children, style, disabled, type }) {
  const [h, setH] = useState(false);
  return (
    <button type={type||'button'} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:disabled?'var(--muted)':h?'var(--clay-deep)':'var(--clay)',color:'#fff',border:'none',borderRadius:999,
        padding:'15px 30px',fontFamily:"'Mulish',sans-serif",fontSize:15,fontWeight:700,
        cursor:disabled?'not-allowed':'pointer',letterSpacing:'.01em',transition:'background .15s',...style}}>
      {children}
    </button>
  );
}

function BtnOutline({ onClick, children, style }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:'none',color:'var(--ink)',border:`1px solid ${h?'var(--ink)':'var(--line)'}`,borderRadius:999,
        padding:'15px 28px',fontFamily:"'Mulish',sans-serif",fontSize:15,fontWeight:600,
        cursor:'pointer',transition:'border-color .15s',...style}}>
      {children}
    </button>
  );
}

/* ---------- ProductCard ---------- */
function ProductCard({ p, onOpen, onAdd, isFav, onFav }) {
  const [hov, setHov] = useState(false);
  const [hovBtn, setHovBtn] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{position:'relative'}}>
        <button onClick={()=>onOpen(p)}
          onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
          style={{border:`1px solid ${hov?'var(--clay)':'var(--line)'}`,borderRadius:12,overflow:'hidden',
            background:'var(--paper)',cursor:'pointer',padding:0,position:'relative',display:'block',width:'100%',
            transition:'border-color .15s'}}>
          {p.photo
            ? <img src={p.photo} alt={p.name} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',display:'block'}}/>
            : <Ph style={{aspectRatio:'1/1'}}/>
          }
          {p.tag && <span style={{position:'absolute',left:11,top:11,fontSize:11,fontWeight:700,color:'#fff',background:p.tone,padding:'4px 9px',borderRadius:999}}>{p.tag}</span>}
        </button>
        {onFav && (
          <button onClick={e=>{e.stopPropagation();onFav(p);}}
            style={{position:'absolute',top:10,right:10,width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.9)',backdropFilter:'blur(4px)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.15)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            <HeartIcon filled={!!isFav}/>
          </button>
        )}
      </div>
      <div style={{padding:'13px 2px 0',display:'flex',flexDirection:'column',flex:1}}>
        <span style={{fontFamily:"'Marcellus',serif",fontSize:19,color:'var(--ink)',lineHeight:1.15}}>{p.name}</span>
        <span style={{fontSize:12.5,color:'var(--muted)',marginTop:3}}>{p.orixa}</span>
        <div style={{marginTop:'auto',paddingTop:12,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
          <span style={{fontSize:17,fontWeight:700,color:'var(--ink)'}}>{brl(p.price)}</span>
          <button onClick={(e)=>{e.stopPropagation();onAdd(p);}}
            onMouseEnter={()=>setHovBtn(true)} onMouseLeave={()=>setHovBtn(false)}
            style={{background:hovBtn?'var(--clay)':'var(--ink)',color:'var(--cream)',border:'none',borderRadius:999,
              padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',transition:'background .15s',whiteSpace:'nowrap'}}>
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Header ---------- */
function NavLink({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:600,
        color:h?'var(--clay)':'var(--ink)',padding:'6px 0',letterSpacing:'.01em',transition:'color .15s'}}>
      {label}
    </button>
  );
}

function HeaderIconBtn({ onClick, ariaLabel, badge, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} aria-label={ariaLabel}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{position:'relative',background:'none',border:`1px solid ${h?'var(--clay)':'var(--line)'}`,
        borderRadius:999,width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',
        cursor:'pointer',transition:'border-color .15s'}}>
      {children}
      {badge>0 && (
        <span style={{position:'absolute',top:-4,right:-4,background:'var(--clay)',color:'#fff',fontSize:11,fontWeight:700,
          minWidth:19,height:19,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 5px'}}>
          {badge}
        </span>
      )}
    </button>
  );
}

function AppHeader({ onHome, onListing, onGuias, onSobre, onContato, onCart, onAccount, cartCount }) {
  return (
    <header className="lj-desktop-header" style={{position:'sticky',top:0,zIndex:40,background:'rgba(245,237,225,.92)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',gap:24}}>
        <button onClick={onHome} style={{display:'flex',alignItems:'center',gap:12,background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0}}>
          <img src="assets/logo-axe.jpeg" alt="Axé de Quitéria" style={{width:48,height:48,borderRadius:'50%',objectFit:'contain',flexShrink:0,boxShadow:'0 0 0 1px var(--line)',background:'var(--cream)'}}/>
          <span style={{textAlign:'left',lineHeight:1}}>
            <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:20,color:'var(--ink)',letterSpacing:'.01em'}}>Axé de Quitéria</span>
            <span style={{display:'block',fontFamily:"'Marcellus SC',serif",fontSize:10,letterSpacing:'.24em',color:'var(--clay)',marginTop:3}}>ARTIGOS RELIGIOSOS</span>
          </span>
        </button>
        <nav style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:26}}>
          {[['Início',onHome],['Loja',onListing],['Guias',onGuias],['Sobre',onSobre],['Contato',onContato]].map(([label,act])=>(
            <NavLink key={label} label={label} onClick={act}/>
          ))}
        </nav>
        <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <HeaderIconBtn onClick={onAccount} ariaLabel="Minha conta"><Icon name="person" size={19}/></HeaderIconBtn>
          <HeaderIconBtn onClick={onCart} ariaLabel="Carrinho" badge={cartCount}><Icon name="bag" size={19}/></HeaderIconBtn>
        </div>
      </div>
    </header>
  );
}

/* ---------- AnnouncementBar ---------- */
function AnnouncementBar() {
  return (
    <div className="lj-announce-bar" style={{background:'var(--ink)',color:'var(--cream)',fontSize:12.5,letterSpacing:'.04em',textAlign:'center',padding:'9px 16px',fontWeight:500}}>
      Frete grátis acima de R$200 &nbsp;·&nbsp; Peças firmadas à mão em Porto Alegre &nbsp;·&nbsp; Atendimento no WhatsApp
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="lj-toast" style={{position:'fixed',left:'50%',bottom:32,transform:'translateX(-50%)',zIndex:70,
      background:'var(--ink)',color:'var(--cream)',padding:'14px 24px',borderRadius:999,
      fontSize:14,fontWeight:600,boxShadow:'0 10px 30px rgba(0,0,0,.25)',whiteSpace:'nowrap',pointerEvents:'none'}}>
      {msg}
    </div>
  );
}

/* ---------- WhatsApp FAB ---------- */
function WaButton() {
  return (
    <a href={`https://wa.me/${LJ_STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"
      className="lj-wa-btn"
      style={{position:'fixed',right:22,bottom:22,zIndex:45,width:56,height:56,borderRadius:'50%',
        background:'#1FA855',display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:'0 8px 24px rgba(0,0,0,.25)',textDecoration:'none'}}>
      <Icon name="wa" size={28} color="#fff"/>
    </a>
  );
}

/* ---------- Drawer base ---------- */
function Drawer({ onClose, width, children }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',justifyContent:'flex-end'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(44,30,20,.5)',animation:'fadeIn .22s ease'}}/>
      <div style={{position:'relative',width:`min(${width||'420px'},100%)`,height:'100%',background:'var(--cream)',
        display:'flex',flexDirection:'column',boxShadow:'-12px 0 40px rgba(0,0,0,.2)',animation:'slideInRight .28s cubic-bezier(.2,.9,.3,1)'}}>
        {children}
      </div>
    </div>
  );
}

/* ---------- AppFooter ---------- */
function FooterLink({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:'none',border:'none',color:h?'#fff':'rgba(245,237,225,.85)',fontSize:14,textAlign:'left',cursor:'pointer',padding:0,transition:'color .15s'}}>
      {label}
    </button>
  );
}

function AppFooter({ onListing, onHome }) {
  return (
    <footer className="lj-footer" style={{background:'var(--ink)',color:'var(--cream)',marginTop:40}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'56px 24px 30px',display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr',gap:36}} className="footer-grid">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <img src="assets/logo-axe.jpeg" alt="Axé de Quitéria" style={{width:52,height:52,borderRadius:'50%',objectFit:'contain',flexShrink:0,boxShadow:'0 0 0 1px rgba(245,237,225,.25)',background:'var(--cream)'}}/>
            <span style={{fontFamily:"'Marcellus',serif",fontSize:22}}>Axé de Quitéria</span>
          </div>
          <p style={{fontSize:14,lineHeight:1.7,color:'rgba(245,237,225,.7)',margin:'14px 0 0',maxWidth:260}}>
            Guias, pulseiras e itens sagrados firmados à mão em Porto Alegre. Axé em cada peça.
          </p>
        </div>
        <div>
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:11,letterSpacing:'.2em',color:'var(--gold-soft)'}}>LOJA</span>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
            {[
              ['Todas as peças', ()=>onListing()],
              ['Guias',          ()=>onListing('guias')],
              ['Pulseiras',      ()=>onListing('pulseiras')],
              ['Braceletes',     ()=>onListing('braceletes')],
            ].map(([l,a])=>(
              <FooterLink key={l} label={l} onClick={a}/>
            ))}
          </div>
        </div>
        <div>
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:11,letterSpacing:'.2em',color:'var(--gold-soft)'}}>ATENDIMENTO</span>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
            {['Segunda a sexta, 9h–18h','Sábados, 9h–13h','Envio para todo o Brasil','Trocas em até 7 dias'].map(t=>(
              <span key={t} style={{color:'rgba(245,237,225,.85)',fontSize:14}}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:11,letterSpacing:'.2em',color:'var(--gold-soft)'}}>FALE CONOSCO</span>
          <div style={{color:'rgba(245,237,225,.85)',fontSize:14,lineHeight:1.7,marginTop:16,display:'flex',flexDirection:'column',gap:6}}>
            <span>Porto Alegre · RS</span>
            <a href={`https://wa.me/${LJ_STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{color:'#4EE87A',textDecoration:'none',fontWeight:600}}>
              WhatsApp: (51) 99681-3336
            </a>
            <span>{LJ_STORE.email}</span>
          </div>
        </div>
      </div>
      <div style={{borderTop:'1px solid rgba(245,237,225,.14)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'18px 24px',display:'flex',flexWrap:'wrap',gap:10,justifyContent:'space-between',fontSize:12.5,color:'rgba(245,237,225,.6)'}}>
          <span>© {new Date().getFullYear()} Axé de Quitéria · Todos os direitos reservados</span>
          <span>Pagamento seguro · Pix · Cartão · Boleto</span>
        </div>
      </div>
    </footer>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled?'#C4553B':'none'}
      stroke={filled?'#C4553B':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

/* ---------- Bottom Tab Bar (mobile PWA) ---------- */
function BottomTabBar({ activeTab, onTab, cartCount }) {
  const tabs = [
    { id:'home',    label:'Início',  iconPath:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
    { id:'shop',    label:'Loja',    iconPath:'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
    { id:'cart',    label:'Sacola',  iconPath:'M6 8h12l-1 12H7L6 8z M9 8V6a3 3 0 0 1 6 0v2' },
    { id:'account', label:'Conta',   iconPath:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  ];
  return (
    <nav className="lj-bottom-tabs" role="tablist" aria-label="Navegação principal">
      {tabs.map(t => (
        <button key={t.id} role="tab" aria-selected={activeTab===t.id} aria-label={t.label}
          className={`lj-tab-item${activeTab===t.id?' active':''}`}
          onClick={()=>onTab(t.id)}>
          <svg className="lj-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {t.iconPath.split(' M').map((seg,i)=>(
              <path key={i} d={i===0?seg:'M'+seg}/>
            ))}
          </svg>
          {t.id==='cart' && cartCount>0 && (
            <span className="lj-tab-badge" aria-label={`${cartCount} itens`}>{cartCount}</span>
          )}
          <span className="lj-tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------- Mobile Header (per-screen) ---------- */
function MobileHeader({ title, onBack, backLabel, onCart, cartCount, onMenu, actions }) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const backChar = isIOS ? '‹' : '←';
  return (
    <div className="lj-mobile-header" role="banner">
      {onBack ? (
        <button className="lj-mobile-back-btn" onClick={onBack} aria-label="Voltar">
          <span style={{fontSize:isIOS?26:20,lineHeight:1}}>{backChar}</span>
          {backLabel && <span style={{fontSize:14,color:'var(--clay)',fontWeight:600,marginLeft:2}}>{backLabel}</span>}
        </button>
      ) : (
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {onMenu && (
            <button className="lj-mobile-menu-btn" onClick={onMenu} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>
              </svg>
            </button>
          )}
          <img src="assets/logo-axe.jpeg" alt="Axé de Quitéria" style={{width:34,height:34,borderRadius:'50%',objectFit:'contain',boxShadow:'0 0 0 1px var(--line)'}}/>
        </div>
      )}
      <span className="lj-mobile-header-title">{title || 'Axé de Quitéria'}</span>
      {onCart && (
        <button className="lj-mobile-header-action" onClick={onCart} aria-label={`Carrinho${cartCount>0?`, ${cartCount} itens`:''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
          </svg>
          {cartCount>0 && (
            <span style={{position:'absolute',top:2,right:2,background:'var(--clay)',color:'#fff',fontSize:9,fontWeight:700,
              minWidth:15,height:15,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 3px'}}>
              {cartCount}
            </span>
          )}
        </button>
      )}
      {actions}
    </div>
  );
}

/* ---------- Side Menu Drawer ---------- */
function SideMenuDrawer({ open, onClose, onHome, onListing, onGuias, onSobre, onContato, onAccount, user, onLogout }) {
  if (!open) return null;
  const navItems = [
    { label:'Início',  fn: onHome },
    { label:'Loja',    fn: onListing },
    { label:'Guias',   fn: onGuias },
    { label:'Sobre',   fn: onSobre },
    { label:'Contato', fn: onContato },
  ];
  return (
    <div className="lj-side-drawer-overlay">
      <div className="lj-side-drawer-backdrop" onClick={onClose}/>
      <div className="lj-side-drawer">
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'20px 16px',borderBottom:'1px solid var(--line)',flexShrink:0}}>
          <img src="assets/logo-axe.jpeg" alt="Axé de Quitéria" style={{width:40,height:40,borderRadius:'50%',objectFit:'contain',boxShadow:'0 0 0 1px var(--line)'}}/>
          <span style={{flex:1,fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)'}}>Axé de Quitéria</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'var(--muted)',lineHeight:1,padding:'4px 8px'}}>×</button>
        </div>
        {/* Nav */}
        <nav style={{flex:1}}>
          {navItems.map(({label, fn})=>(
            <button key={label} className="lj-drawer-nav-btn" onClick={()=>{fn&&fn();onClose();}}>
              {label}
            </button>
          ))}
        </nav>
        {/* Divider */}
        <div style={{height:1,background:'var(--line)',margin:'0 20px'}}/>
        {/* Account */}
        {user ? (
          <>
            <button className="lj-drawer-nav-btn" onClick={()=>{onAccount&&onAccount();onClose();}}>
              <span style={{width:36,height:36,borderRadius:'50%',background:'var(--clay)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Marcellus',serif",fontSize:16,flexShrink:0}}>
                {(user.nome||'U').charAt(0).toUpperCase()}
              </span>
              <span>
                <span style={{display:'block',fontSize:14,fontWeight:700,color:'var(--ink)'}}>{user.nome}</span>
                <span style={{display:'block',fontSize:12,color:'var(--muted)'}}>{user.email}</span>
              </span>
            </button>
            <button className="lj-drawer-nav-btn" onClick={()=>{onLogout&&onLogout();onClose();}}
              style={{color:'var(--clay-deep)',borderBottom:'none',marginBottom:16}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/></svg>
              Sair da conta
            </button>
          </>
        ) : (
          <button className="lj-drawer-nav-btn" onClick={()=>{onAccount&&onAccount();onClose();}}
            style={{borderBottom:'none',marginBottom:16}}>
            <span style={{width:36,height:36,borderRadius:'50%',background:'var(--cream-2)',color:'var(--clay)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/></svg>
            </span>
            Entrar / Criar conta
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Ph, BtnClay, BtnOutline, ProductCard, AppHeader, AnnouncementBar, Toast, WaButton, Drawer, NavLink, HeaderIconBtn, AppFooter, HeartIcon, BottomTabBar, MobileHeader, SideMenuDrawer });
