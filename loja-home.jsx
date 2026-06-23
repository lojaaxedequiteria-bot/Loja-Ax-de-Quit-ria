/* ===== Axé de Quitéria — Loja: Home / Vitrine ===== */
const CAT_TINTS = {
  guias: { bg: 'var(--clay-soft)', fg: 'var(--clay)' },
  fios: { bg: '#E6EEF2', fg: '#5B7B96' },
  ferramentas: { bg: 'var(--gold-soft)', fg: 'var(--gold)' },
  pulseiras: { bg: '#EFE0E2', fg: '#9A4E55' },
  braceletes: { bg: 'var(--gold-soft)', fg: '#A57E2A' },
  patua: { bg: '#EAD9D2', fg: '#7A2A24' },
  vestuario: { bg: '#EDEAE0', fg: '#7A6A4A' },
  chapeus: { bg: 'var(--clay-soft)', fg: 'var(--clay-deep)' },
  banhos: { bg: 'var(--olive-soft)', fg: 'var(--olive)' }
};

function ProductCard({ p, onOpen, onAdd, added }) {
  const badgeCls = p.badge === 'Oferta' ? 'oferta' : p.badge === 'Novo' ? 'novo' : '';
  const catName = (LJ_CATEGORIES.find((c) => c.id === p.categoria) || {}).name || '';
  const sub = p.orixa || catName;
  return (
    <div className="lj-card" onClick={() => onOpen(p)}>
      <div className="lj-thumb">
        <ProductImage product={p} variant="ring" />
        {p.badge && <span className={'lj-pbadge ' + badgeCls}>{p.badge}</span>}
        <button className={'lj-quickadd' + (added ? ' added' : '')}
        onClick={(e) => {e.stopPropagation();onAdd(p);}}
        aria-label="Adicionar ao carrinho">
          <Icon name={added ? 'check' : 'plus'} size={19} />
        </button>
      </div>
      <div className="lj-card-name">{p.nome}</div>
      <div className="lj-card-orixa" style={p.orixa ? null : { color: 'var(--ink-3)', fontWeight: 600 }}>{sub}</div>
      <div className="lj-card-price">
        <span className="now">{brl(p.preco)}</span>
        {p.preco_antigo && <span className="old">{brl(p.preco_antigo)}</span>}
      </div>
      <div className="lj-rating"><Stars value={p.avaliacao} /><span style={{ color: 'var(--ink-3)' }}>({p.num_avaliacoes})</span></div>
    </div>);

}

/* ---- vitrine rotativa: cada slide destaca um produto/categoria ---- */
const HERO_SLIDES = [
{ pid: 'gp-oxum', eyebrow: 'Coleção de guias', title: 'Vista a sua <em>fé</em> com axé', sub: 'Guias feitas à mão, conta por conta, com respeito ao fundamento.', cta: 'Ver guias', cat: 'guias',
  bg: 'linear-gradient(160deg,#8E4023,#6E2C18 48%,#3A1A12)', accent: '#E8C86B' },
{ pid: 'gp-iemanja', eyebrow: 'Alto fundamento', title: 'O brilho do <em>mar</em> de Iemanjá', sub: 'Brajás e peças premium com búzios e madrepérola natural.', cta: 'Quero conhecer', cat: 'guias',
  bg: 'linear-gradient(160deg,#2F5A78,#1E3F57 50%,#10222F)', accent: '#BFD6E6' },
{ pid: 'ch-turbante', eyebrow: 'Coroa de pano', title: 'Turbantes que <em>elevam</em> a coroa', sub: 'Estampas exclusivas, pré-amarrados, fáceis de vestir.', cta: 'Ver vestuário', cat: 'chapeus',
  bg: 'linear-gradient(160deg,#7A2A24,#9B3022 50%,#4A1712)', accent: '#C9A24B' },
{ pid: 'pl-7orixas', eyebrow: 'Proteção no pulso', title: 'Leve seus <em>orixás</em> com você', sub: 'Pulseiras das sete cores, firmas e cristais selecionados.', cta: 'Ver pulseiras', cat: 'pulseiras',
  bg: 'linear-gradient(160deg,#566B49,#3E5236 50%,#243019)', accent: '#C9D9B8' }];


function HeroVitrine({ onCategory, onOpen }) {
  const [i, setI] = useState(0);
  const n = HERO_SLIDES.length;
  const pausedRef = useRef(false);
  useEffect(() => {
    const iv = setInterval(() => {if (!pausedRef.current) setI((x) => (x + 1) % n);}, 4500);
    return () => clearInterval(iv);
  }, [n]);
  const go = (d) => setI((x) => ((x + d) % n + n) % n);

  return (
    <div className="lj-hero lj-fade"
    onMouseEnter={() => pausedRef.current = true} onMouseLeave={() => pausedRef.current = false}>
      {HERO_SLIDES.map((s, idx) => {
        const prod = LJ_PRODUCTS.find((p) => p.id === s.pid);
        return (
          <div key={idx} className={'lj-hero-slide' + (idx === i ? ' on' : '')} style={{ background: s.bg }}>
            <div className="lj-hero-orn" />
            <div className="lj-hero-ring">
              {prod && <ProductImage product={{ cores: prod.cores, tom: 'transparent' }} variant="ring" bare />}
            </div>
            <div className="lj-hero-body">
              <div className="lj-hero-eyebrow" style={{ color: s.accent }}>{s.eyebrow}</div>
              <div className="lj-hero-title" dangerouslySetInnerHTML={{ __html: s.title }} />
              <div className="lj-hero-sub">{s.sub}</div>
              <div className="lj-hero-cta" style={{ display: 'flex', gap: 10 }}>
                <button className="lj-btn gold lg" onClick={() => onCategory(s.cat)}>{s.cta} <Icon name="chevR" size={18} /></button>
                {prod && <button className="lj-btn light lg" onClick={() => onOpen(prod)}>{brl(prod.preco)}</button>}
              </div>
            </div>
          </div>);

      })}
      <div className="lj-hero-dots">
        {HERO_SLIDES.map((_, idx) =>
        <div key={idx} className={'lj-hero-dot' + (idx === i ? ' on' : '')} onClick={() => setI(idx)} />
        )}
      </div>
      <button className="lj-hero-nav prev" onClick={() => go(-1)} aria-label="Anterior" style={{ opacity: "0.04" }}><Icon name="chevL" size={20} /></button>
      <button className="lj-hero-nav next" onClick={() => go(1)} aria-label="Próximo" style={{ opacity: "0.4" }}><Icon name="chevR" size={20} /></button>
    </div>);

}

/* ---- carrossel de categorias com setas dos dois lados ---- */
function CategoryCarousel({ onCategory }) {
  const ref = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const countByCat = (id) => LJ_PRODUCTS.filter((p) => p.categoria === id).length;

  function update() {
    const el = ref.current;if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }
  useEffect(() => {update();}, []);
  function scrollBy(d) {const el = ref.current;if (el) el.scrollBy({ left: d * 168, behavior: 'smooth' });}

  return (
    <div className="lj-cats-wrap">
      <button className="lj-cats-arrow prev" disabled={atStart} onClick={() => scrollBy(-1)} aria-label="Anterior"><Icon name="chevL" size={19} /></button>
      <div className="lj-cats" ref={ref} onScroll={update}>
        {LJ_CATEGORIES.map((c) => {
          const t = CAT_TINTS[c.id] || { bg: 'var(--paper-2)', fg: 'var(--clay)' };
          return (
            <div key={c.id} className="lj-cat" onClick={() => onCategory(c.id)}>
              <div className="lj-cat-ico" style={{ background: t.bg, color: t.fg }}><Icon name={c.icon} size={24} /></div>
              <div className="lj-cat-name">{c.name}</div>
              <div className="lj-cat-desc">{countByCat(c.id)} {countByCat(c.id) === 1 ? 'item' : 'itens'}</div>
            </div>);

        })}
      </div>
      <button className="lj-cats-arrow next" disabled={atEnd} onClick={() => scrollBy(1)} aria-label="Próximo"><Icon name="chevR" size={19} /></button>
    </div>);

}

function HomeScreen({ onOpen, onAdd, onCategory, addedIds, onMenu, onCart, cartCount, onAccount, user }) {
  const destaques = LJ_PRODUCTS.filter((p) => p.destaque);
  return (
    <>
      <Header onMenu={onMenu} onCart={onCart} cartCount={cartCount} onAccount={onAccount} user={user} />
      <div className="lj-scroll">
        <HeroVitrine onCategory={onCategory} onOpen={onOpen} />

        {/* CATEGORIAS */}
        <div className="lj-sec">
          <div className="lj-sec-h"><div className="t"><small>Explorar</small>Categorias</div></div>
          <CategoryCarousel onCategory={onCategory} />
        </div>

        {/* DESTAQUES */}
        <div className="lj-sec">
          <div className="lj-sec-h">
            <div className="t"><small>Feitas à mão</small>Destaques do ateliê</div>
            <div className="more" onClick={() => onCategory('all')}>Ver tudo <Icon name="chevR" size={14} /></div>
          </div>
          <div className="lj-grid">
            {destaques.map((p) =>
            <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} added={addedIds.includes(p.id)} />
            )}
          </div>
        </div>

        {/* FAIXA DE CONFIANÇA */}
        <div className="lj-trust">
          <div className="lj-trust-item"><div className="i"><Icon name="hand" size={22} /></div><div className="t">Feito à mão<br />com axé</div></div>
          <div className="lj-trust-item"><div className="i"><Icon name="shield" size={22} /></div><div className="t">Fundamento<br />respeitado</div></div>
          <div className="lj-trust-item"><div className="i"><Icon name="truck" size={22} /></div><div className="t">Envio para<br />todo Brasil</div></div>
        </div>

        <div style={{ height: 30 }} />
      </div>
    </>);

}

/* ---- header reutilizável ---- */
function Header({ onMenu, onCart, cartCount, title, onBack, onAccount, user }) {
  return (
    <div className="lj-head">
      {onBack ?
      <div className="lj-iconbtn" onClick={onBack}><Icon name="chevL" size={22} /></div> :
      <div className="lj-iconbtn" onClick={onMenu}><Icon name="menu" size={22} /></div>}
      {title ?
      <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 18 }}>{title}</div> :
      <div className="lj-head-logo"><img src="assets/logo-circ.png" alt="Axé de Quitéria" /><span className="lj-wordmark">Axé de Quitéria</span></div>}
      <div style={{ display: 'flex', gap: 9 }}>
        {onAccount &&
        <div className="lj-iconbtn" onClick={onAccount} aria-label="Minha conta">
            {user ?
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--clay)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 13 }}>{(user.nome || '?').trim()[0].toUpperCase()}</span> :
          <Icon name="user" size={21} />}
          </div>
        }
        <div className="lj-iconbtn" onClick={onCart}>
          <Icon name="cart" size={22} />
          {cartCount > 0 && <span className="lj-badge">{cartCount}</span>}
        </div>
      </div>
    </div>);

}

/* ---- listagem por categoria ---- */
function CategoryScreen({ catId, onOpen, onAdd, addedIds, onCart, cartCount, onBack }) {
  const cat = LJ_CATEGORIES.find((c) => c.id === catId);
  const list = catId === 'all' ? LJ_PRODUCTS : LJ_PRODUCTS.filter((p) => p.categoria === catId);
  return (
    <>
      <Header onBack={onBack} onCart={onCart} cartCount={cartCount} title={cat ? cat.name : 'Todos os produtos'} />
      <div className="lj-scroll lj-fade">
        <div style={{ padding: '18px 18px 6px' }}>
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 26, letterSpacing: '-.01em' }}>{cat ? cat.name : 'Todos os produtos'}</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 4 }}>{cat ? cat.desc : 'A coleção completa do ateliê'} · {list.length} {list.length === 1 ? 'item' : 'itens'}</div>
        </div>
        <div className="lj-grid" style={{ paddingTop: 12 }}>
          {list.map((p) =>
          <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} added={addedIds.includes(p.id)} />
          )}
        </div>
        <div style={{ height: 30 }} />
      </div>
    </>);

}

Object.assign(window, { HomeScreen, Header, CategoryScreen, ProductCard, HeroVitrine, CategoryCarousel, CAT_TINTS });