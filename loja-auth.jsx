/* ===== Axé de Quitéria — Loja: Login/Cadastro de clientes + Conta ===== */
const LJ_USER_KEY = 'axe-quiteria:loja:user:v1';

function loadUser(){ try{ return JSON.parse(localStorage.getItem(LJ_USER_KEY)||'null'); }catch(e){ return null; } }
function saveUser(u){ try{ u ? localStorage.setItem(LJ_USER_KEY,JSON.stringify(u)) : localStorage.removeItem(LJ_USER_KEY); }catch(e){} }

/* ---------- Tela de Login / Cadastro ---------- */
function AuthScreen({ onBack, onAuth }){
  const [mode,setMode] = useState('login'); // 'login' | 'signup'
  const [form,setForm] = useState({ nome:'', email:'', tel:'', senha:'' });
  const [err,setErr] = useState('');
  const set = (k)=>(e)=> { setForm({...form,[k]:e.target.value}); setErr(''); };

  function submit(){
    if(mode==='signup' && !form.nome.trim()){ setErr('Informe seu nome.'); return; }
    if(!form.email.trim() && !form.tel.trim()){ setErr('Informe e-mail ou WhatsApp.'); return; }
    if(!form.senha.trim() || form.senha.length<4){ setErr('Senha de pelo menos 4 caracteres.'); return; }
    // === INTEGRAÇÃO SUPABASE (Next.js) ===
    // signup → supabase.auth.signUp({ email, password }) + insert em `clientes`
    // login  → supabase.auth.signInWithPassword({ email, password })
    const user = {
      id: 'cli-'+Date.now().toString(36),
      nome: form.nome.trim() || (form.email.split('@')[0]) || 'Cliente',
      email: form.email.trim(),
      tel: form.tel.trim(),
      since: Date.now(),
    };
    saveUser(user);
    onAuth(user);
  }

  return (
    <>
      <Header onBack={onBack} title={mode==='login'?'Entrar':'Criar conta'}/>
      <div className="lj-scroll lj-fade">
        <div style={{padding:'10px 22px 0',textAlign:'center'}}>
          <img src="assets/logo-circ.png" alt="" style={{width:76,height:76,borderRadius:'50%',boxShadow:'var(--shadow)',margin:'8px auto 16px'}}/>
          <div style={{fontFamily:'var(--font-d)',fontWeight:600,fontSize:25,lineHeight:1.1}}>
            {mode==='login' ? 'Bem-vinda de volta' : 'Faça parte do axé'}
          </div>
          <div style={{fontSize:14,color:'var(--ink-2)',marginTop:8,maxWidth:300,margin:'8px auto 0'}}>
            {mode==='login'
              ? 'Entre para acompanhar seus pedidos e agilizar suas compras.'
              : 'Crie sua conta para salvar endereços, favoritos e histórico.'}
          </div>
        </div>

        {/* alternador */}
        <div style={{display:'flex',gap:8,background:'var(--paper-2)',borderRadius:100,padding:5,margin:'22px 22px 18px'}}>
          {[['login','Entrar'],['signup','Criar conta']].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr('');}}
              style={{flex:1,border:0,borderRadius:100,padding:'11px 0',fontFamily:'var(--font-b)',fontWeight:700,fontSize:14,cursor:'pointer',
                background:mode===m?'var(--card)':'transparent',color:mode===m?'var(--clay)':'var(--ink-3)',
                boxShadow:mode===m?'var(--shadow-sm)':'none',transition:'.18s'}}>{l}</button>
          ))}
        </div>

        <div style={{padding:'0 22px'}}>
          {mode==='signup' && (
            <div className="lj-field"><label>Nome completo</label>
              <input className="lj-input" value={form.nome} onChange={set('nome')} placeholder="Seu nome"/></div>
          )}
          <div className="lj-field"><label>E-mail</label>
            <input className="lj-input" value={form.email} onChange={set('email')} placeholder="voce@email.com" inputMode="email"/></div>
          <div className="lj-field"><label>WhatsApp {mode==='login'&&<span style={{color:'var(--ink-3)',fontWeight:500}}>(ou e-mail)</span>}</label>
            <input className="lj-input" value={form.tel} onChange={set('tel')} placeholder="(51) 9...." inputMode="tel"/></div>
          <div className="lj-field"><label>Senha</label>
            <input className="lj-input" type="password" value={form.senha} onChange={set('senha')} placeholder="••••••"/></div>

          {err && <div style={{color:'var(--danger)',fontSize:13,fontWeight:700,marginBottom:12}}>{err}</div>}

          <button className="lj-btn primary block lg" onClick={submit}>
            {mode==='login' ? 'Entrar' : 'Criar minha conta'}
          </button>

          {mode==='login' && (
            <button style={{width:'100%',background:'none',border:0,color:'var(--ink-3)',fontSize:13,fontWeight:600,padding:'14px 0',cursor:'pointer'}}>
              Esqueci minha senha
            </button>
          )}

          <div style={{textAlign:'center',fontSize:12,color:'var(--ink-3)',margin:'10px 0 26px',lineHeight:1.5}}>
            Ao continuar, você concorda com nossos<br/>Termos de Uso e Política de Privacidade.
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Tela da Conta (logada) ---------- */
function AccountScreen({ user, onBack, onLogout, onCategory }){
  const items = [
    { ico:'bag',   nm:'Meus pedidos',     sub:'Acompanhe suas compras' },
    { ico:'heart', nm:'Favoritos',         sub:'Peças que você amou' },
    { ico:'pin',   nm:'Endereços',         sub:'Entrega mais rápida' },
    { ico:'shield',nm:'Dados e segurança', sub:'Senha e privacidade' },
  ];
  return (
    <>
      <Header onBack={onBack} title="Minha conta"/>
      <div className="lj-scroll lj-fade">
        {/* cabeçalho do perfil */}
        <div style={{display:'flex',alignItems:'center',gap:15,padding:'22px 22px 18px'}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'var(--clay)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-d)',fontWeight:600,fontSize:26,flexShrink:0,boxShadow:'var(--shadow)'}}>
            {(user.nome||'?').trim()[0].toUpperCase()}
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontFamily:'var(--font-d)',fontWeight:600,fontSize:21,lineHeight:1.1}}>{user.nome}</div>
            <div style={{fontSize:13,color:'var(--ink-3)',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.email || user.tel || 'Cliente do ateliê'}</div>
          </div>
        </div>

        {/* atalhos */}
        <div style={{padding:'0 18px'}}>
          <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,overflow:'hidden'}}>
            {items.map((it,idx)=>(
              <div key={it.nm} className="lj-menu-item" style={{padding:'15px 16px',borderBottom:idx<items.length-1?'1px solid var(--line-2)':'none',margin:0}}>
                <div className="i" style={{background:'var(--paper-2)',color:'var(--clay)'}}><Icon name={it.ico} size={20}/></div>
                <div style={{flex:1}}><div className="nm" style={{fontSize:15}}>{it.nm}</div><div className="sub">{it.sub}</div></div>
                <Icon name="chevR" size={18} style={{color:'var(--ink-3)'}}/>
              </div>
            ))}
          </div>
        </div>

        {/* convite a comprar */}
        <div style={{padding:'18px'}}>
          <div style={{background:'linear-gradient(160deg,var(--paper-2),#EFE3CF)',border:'1px solid var(--line)',borderRadius:18,padding:18,display:'flex',alignItems:'center',gap:14}}>
            <span style={{width:42,height:42,borderRadius:12,background:'var(--gold-soft)',color:'var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon name="spark" size={22}/></span>
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--font-d)',fontWeight:600,fontSize:16}}>Novidades do ateliê</div>
              <div style={{fontSize:12.5,color:'var(--ink-2)',marginTop:2}}>Veja as peças que acabaram de chegar.</div>
            </div>
            <button className="lj-btn ghost" style={{padding:'9px 14px'}} onClick={()=>onCategory('all')}>Ver</button>
          </div>
        </div>

        <div style={{padding:'0 22px 30px'}}>
          <button className="lj-btn ghost block" style={{color:'var(--danger)',borderColor:'var(--danger-soft)'}} onClick={onLogout}>
            Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AuthScreen, AccountScreen, loadUser, saveUser });
