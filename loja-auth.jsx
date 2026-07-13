/* ===== Axé de Quitéria — Loja: Auth e Conta ===== */
const LJ_USER_KEY = 'axe-quiteria:loja:user:v1';
function loadUser(){ try{ return JSON.parse(localStorage.getItem(LJ_USER_KEY)||'null'); }catch(e){ return null; } }
function saveUser(u){ try{ u ? localStorage.setItem(LJ_USER_KEY,JSON.stringify(u)) : localStorage.removeItem(LJ_USER_KEY); }catch(e){} }

/* Sincroniza perfil (nome, telefone, enderecos) com tabela perfis no Supabase */
async function syncPerfil(userId, patch){
  if(!window.LJ_SUPABASE || !userId) return;
  try {
    await LJ_SUPABASE.from('perfis').upsert(
      { id: userId, ...patch, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
  } catch(e) {}
}

/* Carrega perfil do Supabase e mescla com localStorage */
async function loadPerfilRemoto(userId){
  if(!window.LJ_SUPABASE || !userId) return null;
  try {
    const { data } = await LJ_SUPABASE.from('perfis').select('*').eq('id', userId).maybeSingle();
    return data || null;
  } catch(e) { return null; }
}

async function hashSenha(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

/* ── AccountDrawer ── */
function AccountDrawer({ onClose, user, onLogin, onLogout, onAccount }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mode, setMode] = useState('login'); // login | register
  const [nome, setNome] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwReg, setShowPwReg] = useState(false);

  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const handleLogin = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const { data, error } = await LJ_SUPABASE.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      const uid = data.user.id;
      const perfil = await loadPerfilRemoto(uid);
      const userObj = {
        id: uid,
        email: data.user.email,
        nome: perfil?.nome || data.user.user_metadata?.nome || email.split('@')[0],
        telefone: perfil?.telefone || '',
        enderecos: perfil?.enderecos || [],
      };
      saveUser(userObj);
      onLogin(userObj);
      onClose();
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('Email not confirmed')) setErr('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.');
      else if (msg.includes('Invalid login')) setErr('E-mail ou senha incorretos.');
      else setErr(msg || 'Erro ao entrar');
    }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const { data, error } = await LJ_SUPABASE.auth.signUp({ email, password: senha, options: { data: { nome } } });
      if (error) throw error;
      if (data.user && !data.session) {
        setErr('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça login.');
        setMode('login');
      } else {
        onLogin({ id: data.user.id, email: data.user.email, nome, enderecos: [] });
        onClose();
      }
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('already registered') || msg.includes('already been registered')) setErr('E-mail já cadastrado. Faça login.');
      else setErr(msg || 'Erro ao cadastrar');
    }
    finally { setLoading(false); }
  };

  const accountItems = [
    { icon: '📦', label:'Meus pedidos',     sub:'Acompanhe e rastreie suas compras', tab:'pedidos'    },
    { icon: '♡',  label:'Favoritos',        sub:'Peças que você salvou',             tab:'favoritos'  },
    { icon: '📍', label:'Endereços',        sub:'Locais de entrega',                 tab:'enderecos'  },
    { icon: '🔒', label:'Dados e segurança',sub:'E-mail, senha e privacidade',       tab:'seguranca'  },
  ];

  return (
    <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',justifyContent:'flex-end'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(44,30,20,.5)'}}/>
      <div style={{position:'relative',width:'min(400px,100%)',height:'100%',background:'var(--cream)',display:'flex',flexDirection:'column',boxShadow:'-12px 0 40px rgba(0,0,0,.2)'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 24px',borderBottom:'1px solid var(--line)',flexShrink:0}}>
          <span style={{fontFamily:"'Marcellus',serif",fontSize:24,color:'var(--ink)'}}>Minha conta</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'var(--muted)',lineHeight:1}}>×</button>
        </div>

        {/* Deslogado */}
        {!user && (
          <div style={{flex:1,overflowY:'auto',padding:'28px 24px'}}>
            {mode === 'login' ? (
              <>
                <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.6,margin:'0 0 22px'}}>Entre para acompanhar seus pedidos, salvar favoritos e agilizar suas compras.</p>
                <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:12}}>
                  <input className="lj-input" placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  <div style={{position:'relative'}}>
                    <input className="lj-input" placeholder="Senha" type={showPw?'text':'password'} value={senha} onChange={e=>setSenha(e.target.value)} required style={{width:'100%',paddingRight:44,boxSizing:'border-box'}}/>
                    <button type="button" onClick={()=>setShowPw(v=>!v)}
                      style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',padding:0}}>
                      {showPw ? <EyeOff/> : <EyeOpen/>}
                    </button>
                  </div>
                  {err && <p style={{fontSize:13,color:'#c0392b',margin:0}}>{err}</p>}
                  <button type="submit" disabled={loading}
                    style={{width:'100%',marginTop:4,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:15,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
                    {loading?'Entrando…':'Entrar'}
                  </button>
                </form>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:16}}>
                  <button onClick={()=>{setMode('register');setErr('');}} style={{background:'none',border:'none',color:'var(--clay)',fontSize:13.5,fontWeight:700,cursor:'pointer',padding:0}}>Criar conta</button>
                  <button style={{background:'none',border:'none',color:'var(--muted)',fontSize:13.5,cursor:'pointer',padding:0}}>Esqueci a senha</button>
                </div>
              </>
            ) : (
              <>
                <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.6,margin:'0 0 22px'}}>Crie sua conta para acompanhar pedidos e salvar favoritos.</p>
                <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:12}}>
                  <input className="lj-input" placeholder="Seu nome" value={nome} onChange={e=>setNome(e.target.value)} required/>
                  <input className="lj-input" placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  <div style={{position:'relative'}}>
                    <input className="lj-input" placeholder="Senha (mín. 6 caracteres)" type={showPwReg?'text':'password'} minLength={6} value={senha} onChange={e=>setSenha(e.target.value)} required style={{width:'100%',paddingRight:44,boxSizing:'border-box'}}/>
                    <button type="button" onClick={()=>setShowPwReg(v=>!v)}
                      style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',padding:0}}>
                      {showPwReg ? <EyeOff/> : <EyeOpen/>}
                    </button>
                  </div>
                  {err && <p style={{fontSize:13,color:'#c0392b',margin:0}}>{err}</p>}
                  <button type="submit" disabled={loading}
                    style={{width:'100%',marginTop:4,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:15,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
                    {loading?'Cadastrando…':'Criar conta'}
                  </button>
                </form>
                <div style={{display:'flex',justifyContent:'center',marginTop:16}}>
                  <button onClick={()=>{setMode('login');setErr('');}} style={{background:'none',border:'none',color:'var(--clay)',fontSize:13.5,fontWeight:700,cursor:'pointer',padding:0}}>Já tenho conta</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Logado */}
        {user && (
          <>
            <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column'}}>
              {/* Avatar */}
              <div style={{display:'flex',alignItems:'center',gap:14,padding:'22px 24px',borderBottom:'1px solid var(--line)'}}>
                <span style={{width:52,height:52,borderRadius:'50%',background:'var(--clay)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Marcellus',serif",fontSize:22,flexShrink:0}}>
                  {(user.nome||'U').charAt(0).toUpperCase()}
                </span>
                <div>
                  <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)'}}>Olá, {user.nome}</span>
                  <span style={{display:'block',fontSize:13,color:'var(--muted)',marginTop:2}}>{user.email}</span>
                </div>
              </div>

              {/* Menu items */}
              <div style={{padding:'14px 14px 4px'}}>
                {accountItems.map(a=>(
                  <button key={a.tab} onClick={()=>{onAccount(a.tab);onClose();}}
                    style={{width:'100%',display:'flex',alignItems:'center',gap:14,background:'none',border:'none',cursor:'pointer',padding:'14px 12px',borderRadius:12,textAlign:'left'}}>
                    <span style={{width:38,height:38,borderRadius:10,background:'var(--paper)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--clay)',fontSize:17}}>
                      {a.icon}
                    </span>
                    <span style={{flex:1}}>
                      <span style={{display:'block',fontSize:15,fontWeight:700,color:'var(--ink)'}}>{a.label}</span>
                      <span style={{display:'block',fontSize:12.5,color:'var(--muted)',marginTop:1}}>{a.sub}</span>
                    </span>
                    <span style={{color:'var(--muted)',fontSize:18}}>›</span>
                  </button>
                ))}
              </div>

              <div style={{height:1,background:'var(--line)',margin:'8px 24px'}}/>

              {/* Newsletter card */}
              <div style={{margin:'14px 20px 24px',borderRadius:16,overflow:'hidden',background:'var(--clay)'}}>
                <div style={{padding:'22px 22px 24px'}}>
                  <span style={{fontFamily:"'Marcellus SC',serif",fontSize:11,letterSpacing:'.2em',color:'var(--gold-soft)'}}>DO ATELIÊ</span>
                  <h4 style={{fontFamily:"'Marcellus',serif",fontSize:20,color:'var(--cream)',fontWeight:400,margin:'10px 0 8px'}}>Novidades do ateliê</h4>
                  <p style={{fontSize:14,lineHeight:1.65,color:'rgba(245,237,225,.85)',margin:'0 0 18px'}}>Peças novas, encomendas abertas e datas de obrigações direto no seu e-mail.</p>
                  <input placeholder="Seu e-mail" style={{display:'block',width:'100%',border:'none',borderRadius:999,padding:'13px 18px',fontFamily:"'Mulish',sans-serif",fontSize:14,background:'var(--cream)',color:'var(--ink)',marginBottom:10}}/>
                  <button style={{display:'block',width:'100%',background:'var(--ink)',color:'var(--cream)',border:'none',borderRadius:999,padding:13,fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer'}}>Assinar novidades</button>
                </div>
              </div>
            </div>

            {/* Sair */}
            <div style={{borderTop:'1px solid var(--line)',padding:'16px 24px 24px',flexShrink:0}}>
              <button onClick={()=>{onLogout();onClose();}}
                style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'none',border:'1px solid var(--line)',borderRadius:999,padding:14,fontFamily:"'Mulish',sans-serif",fontSize:15,fontWeight:700,color:'var(--clay-deep)',cursor:'pointer'}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/></svg>
                Sair da conta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── AccountScreen ── */
function AccountScreen({ user, onLogin, onLogout, onHome, favorites, onOpen, onUpdateUser }) {
  const [tab, setTab] = useState('pedidos');
  const [mobileTab, setMobileTab] = useState(null); // null = list view, string = sub-screen

  /* Mobile login form state */
  const [mEmail, setMEmail]   = useState('');
  const [mSenha, setMSenha]   = useState('');
  const [mNome,  setMNome]    = useState('');
  const [mMode,  setMMode]    = useState('login');
  const [mErr,   setMErr]     = useState('');
  const [mLoad,  setMLoad]    = useState(false);

  const tabs = [
    { key:'pedidos',   label:'Meus pedidos',     icon:'📦' },
    { key:'favoritos', label:'Favoritos',         icon:'♡'  },
    { key:'enderecos', label:'Endereços',         icon:'📍' },
    { key:'seguranca', label:'Dados e segurança', icon:'🔒' },
  ];

  const handleMobileLogin = async (e) => {
    e.preventDefault(); setMErr(''); setMLoad(true);
    try {
      const { data, error } = await LJ_SUPABASE.auth.signInWithPassword({ email: mEmail, password: mSenha });
      if (error) throw error;
      const uid = data.user.id;
      const perfil = await loadPerfilRemoto(uid);
      const u = { id: uid, email: data.user.email,
        nome: perfil?.nome || data.user.user_metadata?.nome || mEmail.split('@')[0],
        telefone: perfil?.telefone || '', enderecos: perfil?.enderecos || [] };
      saveUser(u);
      if (onLogin) onLogin(u);
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('Email not confirmed')) setMErr('Confirme seu e-mail antes de entrar.');
      else if (msg.includes('Invalid login')) setMErr('E-mail ou senha incorretos.');
      else setMErr(msg || 'Erro ao entrar');
    } finally { setMLoad(false); }
  };

  const handleMobileRegister = async (e) => {
    e.preventDefault(); setMErr(''); setMLoad(true);
    try {
      const { data, error } = await LJ_SUPABASE.auth.signUp({ email: mEmail, password: mSenha, options: { data: { nome: mNome } } });
      if (error) throw error;
      if (data.user && !data.session) {
        setMErr('Cadastro realizado! Verifique seu e-mail e depois faça login.');
        setMMode('login');
      } else {
        const u = { id: data.user.id, email: data.user.email, nome: mNome, enderecos: [] };
        saveUser(u);
        if (onLogin) onLogin(u);
      }
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('already registered') || msg.includes('already been registered')) setMErr('E-mail já cadastrado. Faça login.');
      else setMErr(msg || 'Erro ao cadastrar');
    } finally { setMLoad(false); }
  };

  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'40px 24px 24px'}}>

      {/* ── Layout Mobile ── */}
      <div className="lj-account-mobile">
        {/* Não logado: formulário inline */}
        {!user && (
          <div style={{maxWidth:400}}>
            <h1 style={{fontFamily:"'Marcellus',serif",fontSize:30,margin:'0 0 6px',fontWeight:400,color:'var(--ink)'}}>Minha conta</h1>
            <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.6,margin:'0 0 24px'}}>Entre para acompanhar seus pedidos e favoritos.</p>
            {mMode === 'login' ? (
              <form onSubmit={handleMobileLogin} style={{display:'flex',flexDirection:'column',gap:12}}>
                <input className="lj-input" placeholder="E-mail" type="email" value={mEmail} onChange={e=>setMEmail(e.target.value)} required/>
                <input className="lj-input" placeholder="Senha" type="password" value={mSenha} onChange={e=>setMSenha(e.target.value)} required/>
                {mErr && <p style={{fontSize:13,color:'#c0392b',margin:0}}>{mErr}</p>}
                <button type="submit" disabled={mLoad}
                  style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:15,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
                  {mLoad?'Entrando…':'Entrar'}
                </button>
                <button type="button" onClick={()=>{setMMode('register');setMErr('');}}
                  style={{background:'none',border:'none',color:'var(--clay)',fontSize:14,fontWeight:700,cursor:'pointer',padding:0,textAlign:'center'}}>
                  Criar conta
                </button>
              </form>
            ) : (
              <form onSubmit={handleMobileRegister} style={{display:'flex',flexDirection:'column',gap:12}}>
                <input className="lj-input" placeholder="Seu nome" value={mNome} onChange={e=>setMNome(e.target.value)} required/>
                <input className="lj-input" placeholder="E-mail" type="email" value={mEmail} onChange={e=>setMEmail(e.target.value)} required/>
                <input className="lj-input" placeholder="Senha (mín. 6 caracteres)" type="password" minLength={6} value={mSenha} onChange={e=>setMSenha(e.target.value)} required/>
                {mErr && <p style={{fontSize:13,color:'#c0392b',margin:0}}>{mErr}</p>}
                <button type="submit" disabled={mLoad}
                  style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:15,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
                  {mLoad?'Cadastrando…':'Criar conta'}
                </button>
                <button type="button" onClick={()=>{setMMode('login');setMErr('');}}
                  style={{background:'none',border:'none',color:'var(--clay)',fontSize:14,fontWeight:700,cursor:'pointer',padding:0,textAlign:'center'}}>
                  Já tenho conta
                </button>
              </form>
            )}
          </div>
        )}

        {/* Logado: lista de navegação */}
        {user && mobileTab === null && (
          <div>
            {/* Avatar */}
            <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:20,borderBottom:'1px solid var(--line)',marginBottom:20}}>
              <span style={{width:52,height:52,borderRadius:'50%',background:'var(--clay)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Marcellus',serif",fontSize:22,flexShrink:0}}>
                {(user.nome||'U').charAt(0).toUpperCase()}
              </span>
              <div>
                <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)'}}>Olá, {user.nome}</span>
                <span style={{display:'block',fontSize:13,color:'var(--muted)',marginTop:2}}>{user.email}</span>
              </div>
            </div>
            {/* Menu */}
            <div style={{border:'1px solid var(--line)',borderRadius:14,overflow:'hidden',background:'var(--paper)'}}>
              {tabs.map((t,i)=>(
                <button key={t.key} onClick={()=>setMobileTab(t.key)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:14,background:'none',border:'none',
                    borderBottom: i<tabs.length-1 ? '1px solid var(--line)' : 'none',
                    cursor:'pointer',padding:'16px 18px',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
                  <span style={{width:38,height:38,borderRadius:10,background:'var(--cream-2)',color:'var(--clay-deep)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:17}}>
                    {t.icon}
                  </span>
                  <span style={{flex:1,fontSize:15,fontWeight:700,color:'var(--ink)'}}>{t.label}</span>
                  <span style={{color:'var(--muted)',fontSize:22}}>›</span>
                </button>
              ))}
            </div>
            <button onClick={()=>{onLogout();onHome();}}
              style={{width:'100%',marginTop:16,display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'none',
                border:'1px solid var(--line)',borderRadius:999,padding:14,fontFamily:"'Mulish',sans-serif",
                fontSize:15,fontWeight:700,color:'var(--clay-deep)',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/></svg>
              Sair da conta
            </button>
          </div>
        )}

        {/* Sub-tela */}
        {user && mobileTab !== null && (
          <div>
            <button onClick={()=>setMobileTab(null)}
              style={{background:'none',border:'none',color:'var(--clay)',fontSize:15,fontWeight:700,cursor:'pointer',padding:'0 0 20px',display:'flex',alignItems:'center',gap:6,WebkitTapHighlightColor:'transparent'}}>
              ← Voltar
            </button>
            {mobileTab === 'pedidos'   && <AccPedidos user={user}/>}
            {mobileTab === 'favoritos' && <AccFavoritos favorites={favorites} onOpen={onOpen}/>}
            {mobileTab === 'enderecos' && <AccEnderecos user={user} onUpdateUser={onUpdateUser}/>}
            {mobileTab === 'seguranca' && <AccSeguranca user={user} onUpdateUser={onUpdateUser}/>}
          </div>
        )}
      </div>

      {/* ── Layout Desktop ── */}
      <div className="lj-account-desktop">
        <div style={{marginBottom:26}}>
          <span style={{fontFamily:"'Marcellus SC',serif",fontSize:12,letterSpacing:'.22em',color:'var(--clay)'}}>MINHA CONTA</span>
          <h1 style={{fontFamily:"'Marcellus',serif",fontSize:38,margin:'8px 0 0',fontWeight:400,color:'var(--ink)'}}>Olá, {user?.nome||'visitante'}</h1>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'250px 1fr',gap:36,alignItems:'start'}} className="account-grid">

          {/* Sidebar */}
          <aside className="account-sidebar" style={{border:'1px solid var(--line)',borderRadius:14,background:'var(--paper)',overflow:'hidden',position:'sticky',top:100}}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:12,background:tab===t.key?'rgba(176,84,47,.08)':'none',border:'none',borderBottom:'1px solid var(--line)',cursor:'pointer',padding:'15px 18px',textAlign:'left',transition:'background .15s'}}>
                <span style={{width:32,height:32,borderRadius:8,background:tab===t.key?'var(--clay)':'var(--cream-2)',color:tab===t.key?'#fff':'var(--clay-deep)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:15,transition:'background .15s'}}>
                  {t.icon}
                </span>
                <span style={{fontSize:14.5,fontWeight:700,color:tab===t.key?'var(--clay)':'var(--ink)'}}>{t.label}</span>
              </button>
            ))}
            <button onClick={()=>{onLogout();onHome();}}
              style={{width:'100%',display:'flex',alignItems:'center',gap:12,background:'none',border:'none',cursor:'pointer',padding:'15px 18px',textAlign:'left'}}>
              <span style={{width:32,height:32,borderRadius:8,background:'var(--cream-2)',color:'var(--clay-deep)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/></svg>
              </span>
              <span style={{fontSize:14.5,fontWeight:700,color:'var(--clay-deep)'}}>Sair da conta</span>
            </button>
          </aside>

          {/* Content */}
          <div>
            {tab === 'pedidos'   && <AccPedidos user={user}/>}
            {tab === 'favoritos' && <AccFavoritos favorites={favorites} onOpen={onOpen}/>}
            {tab === 'enderecos' && <AccEnderecos user={user} onUpdateUser={onUpdateUser}/>}
            {tab === 'seguranca' && <AccSeguranca user={user} onUpdateUser={onUpdateUser}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AccPedidos ── */
function AccPedidos({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackModal, setTrackModal] = useState(null); // order object or null

  const STATUS_MAP = {
    'recebido': { label: 'Pedido recebido',       color: '#8A6A14' },
    'producao': { label: 'Em produção',           color: '#B58A34' },
    'enviando': { label: 'A caminho!',             color: '#2A5A8A' },
    'concluido':{ label: 'Concluído',              color: '#2F4E8A' },
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    // Carrega pedidos do localStorage (inseridos no checkout deste dispositivo)
    try {
      const local = JSON.parse(localStorage.getItem(LJ_ORDERS_KEY)||'[]')||[];
      setOrders(local);
    } catch(_) {}
    setLoading(false);
  }, [user?.email]);

  // Sincroniza status dos pedidos em tempo real com o Supabase
  useEffect(() => {
    if (!window.LJ_SUPABASE || !user?.email) return;
    window.LJ_SUPABASE.from('pedidos')
      .select('numero, status, total, itens, id')
      .filter('cliente->>email', 'eq', user.email)
      .order('id', { ascending: false })
      .then(({ data }) => {
        if (!data || !data.length) return;
        try {
          const cached = JSON.parse(localStorage.getItem(LJ_ORDERS_KEY) || '[]');
          let changed = false;
          const updated = cached.map(o => {
            const fresh = data.find(r => r.numero === o.id || r.id === o.id);
            if (fresh && fresh.status !== o.status) { changed = true; return { ...o, status: fresh.status }; }
            return o;
          });
          // Também adiciona pedidos do Supabase que não estejam no cache local
          data.forEach(r => {
            const exists = updated.find(o => o.id === r.numero || o.id === r.id);
            if (!exists) {
              changed = true;
              updated.unshift({ id: r.numero || r.id, total: r.total, status: r.status, itens: r.itens || [], data: '' });
            }
          });
          if (changed) {
            localStorage.setItem(LJ_ORDERS_KEY, JSON.stringify(updated));
            setOrders(updated);
          }
        } catch(e) {}
      });
  }, [user?.email]);

  if (loading) {
    return (
      <div>
        <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,margin:'0 0 20px',fontWeight:400,color:'var(--ink)'}}>Meus pedidos</h2>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{background:'var(--line)',borderRadius:14,height:80,animation:'shimmer 1.4s ease-in-out infinite alternate',opacity:.6}}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,margin:'0 0 20px',fontWeight:400,color:'var(--ink)'}}>Meus pedidos</h2>
      {(!orders||orders.length===0)
        ? <p style={{color:'var(--muted)',fontSize:15}}>Nenhum pedido ainda.</p>
        : <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {orders.map(o=>{
              const st = STATUS_MAP[o.status] || { label: o.status||'Confirmado', color:'var(--clay)' };
              return (
                <div key={o.id} style={{border:'1px solid var(--line)',borderRadius:14,background:'var(--paper)',overflow:'hidden'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--line)'}}>
                    <div>
                      <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:17,color:'var(--ink)'}}>Pedido #{o.numero||o.id}</span>
                      <span style={{display:'block',fontSize:12.5,color:'var(--muted)',marginTop:2}}>{o.data||''}</span>
                    </div>
                    <span style={{fontSize:12.5,fontWeight:700,color:'#fff',background:st.color,padding:'6px 13px',borderRadius:999}}>{st.label}</span>
                  </div>
                  <div style={{padding:'14px 20px',display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:14,color:'var(--muted)'}}>{o.itens?.length||0} {o.itens?.length===1?'peça':'peças'}</span>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                      <span style={{fontSize:16,fontWeight:700,color:'var(--ink)'}}>{brl(o.total)}</span>
                      <button onClick={()=>setTrackModal(o)}
                        style={{background:'none',border:'1px solid var(--line)',borderRadius:999,padding:'8px 16px',fontSize:13,fontWeight:700,color:'var(--ink)',cursor:'pointer'}}>Rastrear</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      }

      {/* Modal Rastrear */}
      {trackModal && (
        <div style={{position:'fixed',inset:0,zIndex:80,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div onClick={()=>setTrackModal(null)} style={{position:'absolute',inset:0,background:'rgba(44,30,20,.5)'}}/>
          <div style={{position:'relative',background:'var(--cream)',borderRadius:20,padding:'32px 28px',width:'min(440px,90vw)',boxShadow:'0 20px 60px rgba(0,0,0,.18)'}}>
            <button onClick={()=>setTrackModal(null)}
              style={{position:'absolute',right:18,top:18,background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--muted)',lineHeight:1}}>×</button>
            <h3 style={{fontFamily:"'Marcellus',serif",fontSize:22,margin:'0 0 18px',fontWeight:400,color:'var(--ink)'}}>
              Rastrear pedido #{trackModal.numero||trackModal.id}
            </h3>
            {(() => {
              const st = STATUS_MAP[trackModal.status] || { label: trackModal.status||'Confirmado', color:'var(--clay)' };
              return (
                <>
                  <div style={{marginBottom:20}}>
                    <span style={{fontSize:13,fontWeight:700,color:'#fff',background:st.color,padding:'7px 16px',borderRadius:999}}>{st.label}</span>
                  </div>
                  {(trackModal.status === 'enviando' || trackModal.status === 'concluido') && (
                    <a href="https://rastreamento.correios.com.br/app/index.php" target="_blank" rel="noopener noreferrer"
                      style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--clay)',fontSize:15,fontWeight:700,textDecoration:'none'}}>
                      Rastrear nos Correios →
                    </a>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── AccFavoritos ── */
function AccFavoritos({ favorites, onOpen }) {
  return (
    <div>
      <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,margin:'0 0 20px',fontWeight:400,color:'var(--ink)'}}>Favoritos</h2>
      {(!favorites||favorites.length===0)
        ? <p style={{color:'var(--muted)',fontSize:15}}>Nenhum favorito salvo.</p>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:20}}>
            {favorites.map(p=>(
              <div key={p.id} style={{display:'flex',flexDirection:'column'}}>
                <button onClick={()=>onOpen(p)} style={{border:'1px solid var(--line)',borderRadius:12,overflow:'hidden',background:'var(--paper)',cursor:'pointer',padding:0,position:'relative',display:'block'}}>
                  {p.photo
                    ? <img src={p.photo} alt={p.name} style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',display:'block'}}/>
                    : <span style={{display:'block',aspectRatio:'1/1',background:'repeating-linear-gradient(135deg,var(--cream-2) 0 13px,var(--cream-3) 13px 26px)'}}/>
                  }
                  <span style={{position:'absolute',right:11,top:11,width:30,height:30,borderRadius:'50%',background:'rgba(251,246,238,.92)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--clay)',fontSize:15}}>♥</span>
                </button>
                <div style={{padding:'12px 2px 0'}}>
                  <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:17,color:'var(--ink)'}}>{p.name}</span>
                  <span style={{display:'block',fontSize:15,fontWeight:700,color:'var(--ink)',marginTop:6}}>{brl(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

/* ── AccEnderecos ── */
function AccEnderecos({ user, onUpdateUser }) {
  const [addrs, setAddrs] = useState(user?.enderecos || []);
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCep, setNewCep] = useState('');
  const [newEndereco, setNewEndereco] = useState('');
  const [newCidade, setNewCidade] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const saveAddr = (updated) => {
    const fresh = loadUser() || {};
    const next = { ...fresh, enderecos: updated };
    saveUser(next);
    syncPerfil(user?.id, { enderecos: updated });
    if (onUpdateUser) onUpdateUser(next);
  };

  const handleCepBlur = async () => {
    const cepNum = newCep.replace(/\D/g, '');
    if (cepNum.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepNum}/json/`);
      const json = await res.json();
      if (!json.erro) {
        setNewEndereco(json.logradouro ? `${json.logradouro}, ` : '');
        setNewCidade(`${json.localidade} / ${json.uf}`);
      }
    } catch(e) {}
    finally { setCepLoading(false); }
  };

  const handleSaveAddr = () => {
    if (!newEndereco.trim()) return;
    const updated = [...addrs, {
      label: newLabel || 'Endereço',
      cep: newCep,
      endereco: newEndereco,
      cidade: newCidade,
    }];
    setAddrs(updated);
    saveAddr(updated);
    setShowForm(false);
    setNewLabel(''); setNewCep(''); setNewEndereco(''); setNewCidade('');
  };

  const handleRemove = (idx) => {
    const updated = addrs.filter((_,i)=>i!==idx);
    setAddrs(updated);
    saveAddr(updated);
  };

  const handleMakePrincipal = (idx) => {
    const updated = [addrs[idx], ...addrs.filter((_,i)=>i!==idx)];
    setAddrs(updated);
    saveAddr(updated);
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:20}}>
        <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,margin:0,fontWeight:400,color:'var(--ink)'}}>Endereços</h2>
        {!showForm && (
          <button onClick={()=>setShowForm(true)}
            style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'10px 20px',fontSize:14,fontWeight:700,cursor:'pointer'}}>+ Novo endereço</button>
        )}
      </div>

      {/* Form inline */}
      {showForm && (
        <div style={{border:'1px solid var(--line)',borderRadius:14,background:'var(--paper)',padding:20,marginBottom:20}}>
          <h3 style={{fontFamily:"'Marcellus',serif",fontSize:18,margin:'0 0 16px',fontWeight:400,color:'var(--ink)'}}>Novo endereço</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input className="lj-input" placeholder='Label (ex: "Casa")' value={newLabel} onChange={e=>setNewLabel(e.target.value)}/>
            <input className="lj-input" placeholder="CEP" value={newCep} onChange={e=>setNewCep(e.target.value)} onBlur={handleCepBlur} maxLength={9}/>
            {cepLoading && <span style={{fontSize:13,color:'var(--muted)'}}>Buscando endereço…</span>}
            <input className="lj-input" placeholder="Endereço e número" value={newEndereco} onChange={e=>setNewEndereco(e.target.value)}/>
            <input className="lj-input" placeholder="Cidade / UF" value={newCidade} onChange={e=>setNewCidade(e.target.value)}/>
          </div>
          <div style={{display:'flex',gap:12,marginTop:16}}>
            <button onClick={handleSaveAddr}
              style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'11px 24px',fontSize:14,fontWeight:700,cursor:'pointer'}}>Salvar endereço</button>
            <button onClick={()=>{setShowForm(false);setNewLabel('');setNewCep('');setNewEndereco('');setNewCidade('');}}
              style={{background:'none',border:'1px solid var(--line)',borderRadius:999,padding:'11px 24px',fontSize:14,fontWeight:700,cursor:'pointer',color:'var(--muted)'}}>Cancelar</button>
          </div>
        </div>
      )}

      {addrs.length === 0 && !showForm && (
        <p style={{color:'var(--muted)',fontSize:15}}>Nenhum endereço cadastrado ainda.</p>
      )}

      {addrs.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {addrs.map((a,i)=>(
            <div key={i} style={{border:'1px solid var(--line)',borderRadius:14,background:'var(--paper)',padding:20,position:'relative'}}>
              {i===0 && (
                <span style={{position:'absolute',right:16,top:16,fontSize:11,fontWeight:700,color:'#fff',background:'var(--clay)',padding:'4px 10px',borderRadius:999}}>Principal</span>
              )}
              <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:18,color:'var(--ink)',marginBottom:8,paddingRight:i===0?80:0}}>{a.label}</span>
              <p style={{fontSize:14,lineHeight:1.7,color:'var(--muted)',margin:'0 0 16px'}}>
                {a.endereco}{a.cep ? ` — ${a.cep}` : ''}<br/>{a.cidade}
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {i !== 0 && (
                  <button onClick={()=>handleMakePrincipal(i)}
                    style={{background:'none',border:'none',color:'var(--clay)',fontSize:13,fontWeight:700,cursor:'pointer',padding:0}}>Tornar principal</button>
                )}
                <button onClick={()=>handleRemove(i)}
                  style={{background:'none',border:'none',color:'var(--muted)',fontSize:13,cursor:'pointer',padding:0,textDecoration:'underline'}}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AccSeguranca ── */
function AccSeguranca({ user, onUpdateUser }) {
  const [nome,        setNome]        = useState(user?.nome||'');
  const [telefone,    setTelefone]    = useState(user?.telefone||'');
  const [dadosMsg,    setDadosMsg]    = useState('');
  const [dadosSaving, setDadosSaving] = useState(false);

  const [showPwAtual, setShowPwAtual] = useState(false);
  const [showPwNova,  setShowPwNova]  = useState(false);
  const [senhaAtual,  setSenhaAtual]  = useState('');
  const [senhaNova,   setSenhaNova]   = useState('');
  const [pwMsg,       setPwMsg]       = useState('');
  const [pwSaving,    setPwSaving]    = useState(false);

  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div>
      <h2 style={{fontFamily:"'Marcellus',serif",fontSize:26,margin:'0 0 20px',fontWeight:400,color:'var(--ink)'}}>Dados e segurança</h2>
      <div style={{maxWidth:520,display:'flex',flexDirection:'column',gap:28}}>

        {/* ── Dados pessoais ── */}
        <div>
          <h3 style={{fontFamily:"'Marcellus',serif",fontSize:18,margin:'0 0 12px',fontWeight:400,color:'var(--ink)'}}>Dados pessoais</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input className="lj-input" placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)}/>
            <input className="lj-input" placeholder="E-mail" defaultValue={user?.email||''} readOnly
              style={{background:'var(--paper-2)',color:'var(--muted)',cursor:'not-allowed'}}/>
            <input className="lj-input" placeholder="(51) 00000-0000" value={telefone} onChange={e=>setTelefone(e.target.value)}/>
          </div>
          {dadosMsg && (
            <span style={{display:'block',fontSize:13,color:dadosMsg.startsWith('✓')?'var(--clay)':'var(--danger)',marginTop:8}}>{dadosMsg}</span>
          )}
          <button onClick={async()=>{
            setDadosMsg('');
            if(!nome.trim()){ setDadosMsg('Informe o nome.'); return; }
            setDadosSaving(true);
            const fresh = loadUser() || {};
            const next = { ...fresh, nome: nome.trim(), telefone: telefone.trim() };
            saveUser(next);
            await syncPerfil(user?.id, { nome: nome.trim(), telefone: telefone.trim() });
            await LJ_SUPABASE.auth.updateUser({ data: { nome: nome.trim(), telefone: telefone.trim() } });
            if(onUpdateUser) onUpdateUser(next);
            setDadosSaving(false);
            setDadosMsg('✓ Dados salvos!');
          }} disabled={dadosSaving}
            style={{marginTop:14,background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'12px 26px',fontSize:14,fontWeight:700,cursor:'pointer',opacity:dadosSaving?.6:1}}>
            {dadosSaving ? 'Salvando…' : 'Salvar dados'}
          </button>
        </div>

        {/* ── Alterar senha ── */}
        <div>
          <h3 style={{fontFamily:"'Marcellus',serif",fontSize:18,margin:'0 0 12px',fontWeight:400,color:'var(--ink)'}}>Alterar senha</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{position:'relative'}}>
              <input type={showPwAtual?'text':'password'} className="lj-input" placeholder="Senha atual"
                value={senhaAtual} onChange={e=>setSenhaAtual(e.target.value)}
                style={{width:'100%',paddingRight:44,boxSizing:'border-box'}}/>
              <button type="button" onClick={()=>setShowPwAtual(v=>!v)}
                style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',padding:0}}>
                {showPwAtual ? <EyeOff/> : <EyeOpen/>}
              </button>
            </div>
            <div style={{position:'relative'}}>
              <input type={showPwNova?'text':'password'} className="lj-input" placeholder="Nova senha (mín. 6 caracteres)"
                value={senhaNova} onChange={e=>setSenhaNova(e.target.value)}
                style={{width:'100%',paddingRight:44,boxSizing:'border-box'}}/>
              <button type="button" onClick={()=>setShowPwNova(v=>!v)}
                style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',padding:0}}>
                {showPwNova ? <EyeOff/> : <EyeOpen/>}
              </button>
            </div>
            {pwMsg && (
              <span style={{fontSize:13,color:pwMsg.startsWith('✓')?'var(--clay)':'var(--danger)',marginTop:2}}>{pwMsg}</span>
            )}
          </div>
          <button onClick={async()=>{
            setPwMsg('');
            if(!senhaAtual){ setPwMsg('Informe a senha atual.'); return; }
            if(senhaNova.length < 6){ setPwMsg('Nova senha deve ter pelo menos 6 caracteres.'); return; }
            setPwSaving(true);
            const { error: loginErr } = await LJ_SUPABASE.auth.signInWithPassword({ email: user?.email||'', password: senhaAtual });
            if(loginErr){ setPwSaving(false); setPwMsg('Senha atual incorreta.'); return; }
            const { error } = await LJ_SUPABASE.auth.updateUser({ password: senhaNova });
            setPwSaving(false);
            if(error) setPwMsg('Erro: '+error.message);
            else { setPwMsg('✓ Senha alterada com sucesso!'); setSenhaAtual(''); setSenhaNova(''); }
        }} disabled={pwSaving}
          style={{alignSelf:'flex-start',background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'14px 30px',fontSize:15,fontWeight:700,cursor:'pointer',opacity:pwSaving?.6:1}}>
          {pwSaving ? 'Salvando…' : 'Salvar alterações'}
        </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AccountDrawer, AccountScreen, loadUser, saveUser });
