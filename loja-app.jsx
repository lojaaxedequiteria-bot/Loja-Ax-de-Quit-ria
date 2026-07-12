/* ===== Axé de Quitéria — Loja: App Shell ===== */
const LJ_CART_KEY = 'axe-quiteria:loja:cart:v1';
const LJ_FAV_KEY  = 'axe-quiteria:loja:favs:v1';

function loadCart(){ try{ return JSON.parse(localStorage.getItem(LJ_CART_KEY)||'[]')||[]; }catch(e){ return []; } }
function saveCart(c){ try{ localStorage.setItem(LJ_CART_KEY,JSON.stringify(c)); }catch(e){} }
function loadFavs(){ try{ return JSON.parse(localStorage.getItem(LJ_FAV_KEY)||'[]')||[]; }catch(e){ return []; } }
function saveFavs(f){ try{ localStorage.setItem(LJ_FAV_KEY,JSON.stringify(f)); }catch(e){} }
function loadOrders(){ try{ return JSON.parse(localStorage.getItem(LJ_ORDERS_KEY)||'[]')||[]; }catch(e){ return []; } }

/* Detect PWA standalone mode (iOS or Android Chrome) */
const isPWA = window.navigator.standalone === true
  || window.matchMedia('(display-mode: standalone)').matches;
if (isPWA) document.body.classList.add('lj-pwa');

function ShopApp() {
  /* products from Supabase (falls back to LJ_PRODUCTS) */
  const [products, setProducts] = useState(LJ_PRODUCTS);

  /* routing: home | listing | product | checkout | success | account | cart */
  const [screen, setScreen] = useState('home');
  const [listingCat, setListingCat] = useState('todos');
  const [activeProduct, setActiveProduct] = useState(null);
  const [lastOrderNum, setLastOrderNum] = useState('');

  /* active bottom tab (mirrors screen for tab highlighting) */
  const [activeTab, setActiveTab] = useState('home');

  /* drawers */
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* cart */
  const [cart, setCart] = useState(()=>loadCart());

  /* favorites */
  const [favs, setFavs] = useState(()=>loadFavs());

  /* user */
  const [user, setUser] = useState(()=>loadUser());

  /* toast */
  const [toast, setToast] = useState('');
  const toastRef = React.useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(''), 2200);
  };

  /* persist cart */
  useEffect(()=>saveCart(cart),[cart]);
  useEffect(()=>saveFavs(favs),[favs]);

  /* sync favoritos do Supabase quando usuário loga */
  useEffect(()=>{
    if(!user?.email || !window.LJ_FAV_SYNC) return;
    LJ_FAV_SYNC.getAll(user.email).then(remoto=>{
      if(remoto) setFavs(remoto);
    });
  },[user?.email]);

  /* Supabase fetch */
  useEffect(()=>{
    if(!window.LJ_SUPABASE) return;
    LJ_SUPABASE.from('produtos').select('*').then(({data,error})=>{
      if(error||!data?.length) return;
      const mapped = data.map(r=>({
        id:       r.id,
        name:     r.nome||r.name,
        orixa:    r.orixa,
        price:    parseFloat(r.preco||r.price||0),
        tone:     r.tom||r.cor||r.tone||'#B0542F',
        category: r.categoria||r.category||'todos',
        tag:      r.badge||r.tag||'',
        destaque: r.destaque||false,
        photo:    r.foto||r.photo||null,
        fotos:    r.fotos||[],
        desc:     r.descricao||r.desc||'',
        bullets:  r.materiais||r.bullets||[],
      }));
      setProducts(mapped);
    });
  },[]);

  /* cart helpers */
  const addToCart = (p) => {
    setCart(c => {
      const ex = c.find(i=>i.id===p.id);
      if(ex) return c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...c, {...p, qty:1}];
    });
    showToast(`${p.name} adicionada ao carrinho`);
  };

  const setQty = (id, qty) => setCart(c=>c.map(i=>i.id===id?{...i,qty}:i));
  const removeItem = (id) => setCart(c=>c.filter(i=>i.id!==id));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  /* favorite helpers */
  const isFavorite = (p) => favs.some(f=>f.id===p.id);
  const toggleFav = (p) => {
    const wasFav = isFavorite(p);
    setFavs(f => wasFav ? f.filter(x=>x.id!==p.id) : [...f, p]);
    showToast(wasFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    if(user?.email && window.LJ_FAV_SYNC){
      if(wasFav) LJ_FAV_SYNC.remove(user.email, p.id);
      else       LJ_FAV_SYNC.add(user.email, p.id);
    }
  };

  /* navigation helpers */
  const pendingScrollRef = React.useRef(null);
  const goHome    = ()=>{ setScreen('home');    setCartOpen(false); setActiveTab('home'); };
  const goListing = (cat)=>{ setListingCat(cat||'todos'); setScreen('listing'); setCartOpen(false); setActiveTab('shop'); };
  const goProduct = (p)=>{ setActiveProduct(p); setScreen('product'); setCartOpen(false); };
  const goCheckout= ()=>{ setCartOpen(false); setScreen('checkout'); };
  const goSuccess = (num)=>{ clearCart(); setLastOrderNum(num||''); setScreen('success'); };
  const goAccount = ()=>{ setScreen('account'); setAccountOpen(false); setActiveTab('account'); };
  const goCart    = ()=>{ setScreen('cart'); setCartOpen(false); setActiveTab('cart'); };

  /* bottom tab handler */
  const handleTab = (tab) => {
    setActiveTab(tab);
    if (tab==='home')    { setScreen('home');    setCartOpen(false); }
    if (tab==='shop')    { setListingCat('todos'); setScreen('listing'); setCartOpen(false); }
    if (tab==='cart')    { setScreen('cart');    setCartOpen(false); }
    if (tab==='account') { setScreen('account'); setAccountOpen(false); }
  };

  /* scroll to section (Sobre / Contato) — se não estiver na home, navega e depois rola */
  const scrollToSection = (id) => {
    setCartOpen(false);
    if (screen === 'home') {
      document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
    } else {
      pendingScrollRef.current = id;
      setScreen('home');
    }
  };

  /* scroll to top on screen change, ou rola para seção pendente */
  useEffect(()=>{
    if (pendingScrollRef.current) {
      const id = pendingScrollRef.current;
      pendingScrollRef.current = null;
      setTimeout(()=>{ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }, 80);
    } else {
      window.scrollTo({top:0,behavior:'instant'});
    }
  },[screen]);

  const favProducts = favs.map(f => products.find(p=>p.id===f.id)||f);
  const orders = loadOrders();

  /* buy now = add to cart + open checkout */
  const buyNow = (p) => { addToCart(p); setScreen('checkout'); };

  /* screen → tab mapping for active tab highlight */
  const screenToTab = { home:'home', listing:'shop', product:'shop', cart:'cart', account:'account', checkout:'cart', success:'cart' };
  const currentTab = screenToTab[screen] || activeTab;

  /* mobile header config per screen */
  const mobileHeaderProps = () => {
    if (screen==='home')     return { title:null, onBack:null, backLabel:null };
    if (screen==='listing')  return { title:'Loja', onBack:goHome, backLabel:'Início' };
    if (screen==='product')  return { title:activeProduct?.name||'Produto', onBack:()=>goListing(listingCat), backLabel:'Loja' };
    if (screen==='cart')     return { title:'Sacola', onBack:goHome, backLabel:'Início' };
    if (screen==='checkout') return { title:'Finalizar pedido', onBack:goCart, backLabel:'Sacola' };
    if (screen==='success')  return { title:'Pedido realizado', onBack:null, backLabel:null };
    if (screen==='account')  return { title:'Minha conta', onBack:null, backLabel:null };
    return { title:null, onBack:null, backLabel:null };
  };
  const mhp = mobileHeaderProps();

  return (
    <div>
      {/* Desktop navigation */}
      <AnnouncementBar/>
      <AppHeader
        onHome={goHome}
        onListing={()=>goListing()}
        onGuias={()=>goListing('guias')}
        onSobre={()=>scrollToSection('sobre')}
        onContato={()=>scrollToSection('contato')}
        onCart={()=>setCartOpen(true)}
        onAccount={()=>setAccountOpen(true)}
        cartCount={cartCount}
      />

      {/* Mobile header */}
      <MobileHeader
        title={mhp.title}
        onBack={mhp.onBack}
        backLabel={mhp.backLabel}
        onCart={screen!=='cart'&&screen!=='checkout'&&screen!=='account' ? goCart : null}
        cartCount={cartCount}
        onMenu={!mhp.onBack ? ()=>setMenuOpen(true) : null}
      />

      {/* Screens — wrapped in .lj-content for mobile bottom padding */}
      <div className="lj-content">
        {screen === 'home' && (
          <HomeScreen
            products={products}
            onListing={(cat)=>goListing(cat)}
            onOpen={goProduct}
            onAdd={addToCart}
            onSobre={()=>scrollToSection('sobre')}
            onContato={()=>scrollToSection('contato')}
            isFavorite={isFavorite}
            onFavorite={toggleFav}
          />
        )}
        {screen === 'listing' && (
          <ListingScreen
            products={products}
            initialCat={listingCat}
            onOpen={goProduct}
            onAdd={addToCart}
            onHome={goHome}
            isFavorite={isFavorite}
            onFavorite={toggleFav}
          />
        )}
        {screen === 'product' && activeProduct && (
          <ProductScreen
            product={activeProduct}
            products={products}
            onBack={()=>goListing(listingCat)}
            onAdd={addToCart}
            onBuy={goProduct}
            isFavorite={isFavorite(activeProduct)}
            onFavorite={toggleFav}
          />
        )}
        {/* Cart as full screen on mobile (tab) */}
        {screen === 'cart' && (
          <CartScreen
            cart={cart}
            setQty={setQty}
            removeItem={removeItem}
            onCheckout={goCheckout}
            onListing={()=>goListing()}
          />
        )}
        {screen === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            onBack={goCart}
            onSuccess={goSuccess}
            user={user}
          />
        )}
        {screen === 'success' && (
          <SuccessScreen onHome={goHome} onListing={()=>goListing()} orderNum={lastOrderNum}/>
        )}
        {screen === 'account' && (
          <AccountScreen
            user={user}
            onLogin={(u)=>{ setUser(u); saveUser(u); }}
            onLogout={()=>{ setUser(null); saveUser(null); goHome(); }}
            onHome={goHome}
            favorites={favProducts}
            onOpen={goProduct}
            onUpdateUser={(u)=>{ setUser(u); saveUser(u); }}
          />
        )}
      </div>

      {/* Side menu drawer (mobile) */}
      <SideMenuDrawer
        open={menuOpen}
        onClose={()=>setMenuOpen(false)}
        onHome={()=>{ setMenuOpen(false); goHome(); }}
        onListing={()=>{ setMenuOpen(false); goListing(); }}
        onGuias={()=>{ setMenuOpen(false); goListing('guias'); }}
        onSobre={()=>{ setMenuOpen(false); scrollToSection('sobre'); }}
        onContato={()=>{ setMenuOpen(false); scrollToSection('contato'); }}
        onAccount={()=>{ setMenuOpen(false); goAccount(); }}
        user={user}
        onLogout={()=>{ setMenuOpen(false); setUser(null); saveUser(null); goHome(); }}
      />

      {/* Desktop drawers */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={()=>setCartOpen(false)}
          setQty={setQty}
          removeItem={removeItem}
          onCheckout={goCheckout}
          onListing={()=>{ setCartOpen(false); goListing(); }}
        />
      )}
      {accountOpen && (
        <AccountDrawer
          onClose={()=>setAccountOpen(false)}
          user={user}
          onLogin={(u)=>{ setUser(u); saveUser(u); }}
          onLogout={()=>{ setUser(null); saveUser(null); }}
          onAccount={goAccount}
        />
      )}

      {/* Bottom tab bar (mobile only — shown via CSS media query) */}
      <BottomTabBar activeTab={currentTab} onTab={handleTab} cartCount={cartCount}/>

      <WaButton/>
      <Toast msg={toast}/>
    </div>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ShopApp));
