/* ===== Axé de Quitéria — Loja: App shell + roteamento ===== */
const LJ_CART_KEY = 'axe-quiteria:loja:cart:v1';

function loadCart(){ try{ return JSON.parse(localStorage.getItem(LJ_CART_KEY)||'[]')||[]; }catch(e){ return []; } }

/* monta a mensagem do pedido para o WhatsApp da loja */
function buildWhatsMsg(numero, cart, payload){
  const L = [];
  L.push('*Novo pedido ' + numero + '* — Axé de Quitéria');
  L.push('');
  cart.forEach(it=>{ L.push('• ' + it.qty + 'x ' + it.nome + (it.variantText?(' ('+it.variantText+')'):'') + ' — ' + brl(it.preco*it.qty)); });
  L.push('');
  L.push('Subtotal: ' + brl(payload.subtotal));
  L.push('Entrega: ' + payload.ship.label + ' (' + (payload.ship.value===0?'grátis':brl(payload.ship.value)) + ')');
  const payNome = payload.pay==='pix'?'PIX':payload.pay==='card'?'Cartão de crédito':'A combinar';
  L.push('Pagamento: ' + payNome);
  L.push('*Total: ' + brl(payload.total) + '*');
  L.push('');
  L.push('*Cliente:* ' + (payload.form.nome||'—'));
  if(payload.form.tel) L.push('Tel: ' + payload.form.tel);
  if(payload.ship.id!=='retirada'){
    L.push('Endereço: ' + [payload.form.rua, payload.form.num, payload.form.bairro, payload.form.cidade].filter(Boolean).join(', '));
    if(payload.form.cep) L.push('CEP: ' + payload.form.cep);
  }
  return 'https://wa.me/' + LJ_STORE.whatsapp + '?text=' + encodeURIComponent(L.join('\n'));
}

function ShopApp(){
  // rota: {name:'home'|'category'|'product', cat?, product?}
  const [route,setRoute] = useState({name:'home'});
  const [overlay,setOverlay] = useState(null); // 'cart'|'menu'|'checkout'|'success'
  const [cart,setCart] = useState(loadCart);
  const [placing,setPlacing] = useState(false);
  const [lastOrder,setLastOrder] = useState(null);
  const [flash,setFlash] = useState([]); // ids recém-adicionados (feedback do quick-add)
  const [user,setUser] = useState(()=> (window.loadUser ? loadUser() : null));
  const [productsVer, setProductsVer] = useState(0); // força re-render após fetch

  // carrega catálogo real do Supabase (override do mock LJ_PRODUCTS)
  useEffect(()=>{
    const db = window.LJ_SUPABASE;
    if(!db) return;
    db.from('produtos').select('*').eq('ativo', true)
      .order('destaque', {ascending:false})
      .then(({data, error})=>{
        if(data && data.length > 0){
          window.LJ_PRODUCTS = data.map(p=>({
            ...p,
            cores: Array.isArray(p.cores) ? p.cores : [],
            variantes: Array.isArray(p.variantes) ? p.variantes : [],
            materiais: Array.isArray(p.materiais) ? p.materiais : [],
          }));
          setProductsVer(v=>v+1);
        }
        if(error) console.warn('[Loja] Supabase produtos:', error.message);
      });
  }, []);

  // persiste o carrinho no aparelho
  useEffect(()=>{ try{ localStorage.setItem(LJ_CART_KEY, JSON.stringify(cart)); }catch(e){} }, [cart]);

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const scrollTop = ()=> { const el=document.querySelector('.lj-scroll'); if(el) el.scrollTop=0; };

  function go(r){ setRoute(r); setOverlay(null); setTimeout(scrollTop,10); }

  function addToCart(p, sel){
    const variantText = sel ? Object.values(sel).join(' · ') : '';
    const key = p.id + '|' + variantText;
    setCart(c=>{
      const ex = c.find(i=>i.key===key);
      if(ex) return c.map(i=>i.key===key?{...i,qty:i.qty+1}:i);
      return [...c, { key, id:p.id, nome:p.nome, preco:p.preco, cores:p.cores, tom:p.tom, variantText, qty:1 }];
    });
  }
  function quickAdd(p){
    addToCart(p, null);
    setFlash(f=>[...f,p.id]);
    setTimeout(()=> setFlash(f=>f.filter(x=>x!==p.id)), 1200);
  }
  function setQty(key,q){ if(q<=0){ removeItem(key); return; } setCart(c=>c.map(i=>i.key===key?{...i,qty:q}:i)); }
  function removeItem(key){ setCart(c=>c.filter(i=>i.key!==key)); }

  function openProduct(p){ go({name:'product',product:p}); }
  function openCategory(cat){ go({name:'category',cat}); }
  function buyNow(p,sel){ addToCart(p,sel); setOverlay('checkout'); }

  /* ---- POST do pedido → Supabase + WhatsApp ---- */
  async function placeOrder(payload){
    setPlacing(true);
    const ts = Date.now().toString(36).toUpperCase();
    const numero = '#AQ' + ts.slice(-5);
    const id = 'ped-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6);

    const db = window.LJ_SUPABASE;
    if(db){
      const { error } = await db.from('pedidos').insert({
        id, numero,
        cliente: payload.form,
        itens: cart.map(i=>({ id:i.id, nome:i.nome, preco:i.preco, qty:i.qty, variantText:i.variantText||'' })),
        frete: { id:payload.ship.id, label:payload.ship.label, value:payload.ship.value },
        pagamento: payload.pay,
        total: payload.total,
        status: 'producao',
        origem: 'loja',
      });
      if(error) console.error('[Loja] Erro ao salvar pedido:', error.message);
    }

    const wa = buildWhatsMsg(numero, cart, payload);
    setLastOrder({ numero, total:payload.total, ship:payload.ship, wa });
    setCart([]);
    setPlacing(false);
    setOverlay('success');
    setTimeout(scrollTop,10);
    try{ window.open(wa, '_blank'); }catch(e){}
  }

  function openAccount(){ setOverlay(null); setRoute({name: user ? 'account' : 'auth'}); setTimeout(scrollTop,10); }

  const addedIds = cart.map(i=>i.id);
  const flashIds = flash;

  // tela base
  let screen;
  if(route.name==='home'){
    screen = <HomeScreen onOpen={openProduct} onAdd={quickAdd} onCategory={openCategory}
      addedIds={flashIds.length?flashIds:addedIds} onMenu={()=>setOverlay('menu')} onCart={()=>setOverlay('cart')} cartCount={cartCount}
      onAccount={openAccount} user={user}/>;
  } else if(route.name==='category'){
    screen = <CategoryScreen catId={route.cat} onOpen={openProduct} onAdd={quickAdd}
      addedIds={flashIds.length?flashIds:addedIds} onBack={()=>go({name:'home'})} onCart={()=>setOverlay('cart')} cartCount={cartCount}/>;
  } else if(route.name==='product'){
    screen = <ProductScreen product={route.product} onBack={()=>go({name:'home'})}
      onCart={()=>setOverlay('cart')} cartCount={cartCount} onAddToCart={addToCart} onBuyNow={buyNow}/>;
  } else if(route.name==='auth'){
    screen = <AuthScreen onBack={()=>go({name:'home'})} onAuth={(u)=>{ setUser(u); setRoute({name:'account'}); setTimeout(scrollTop,10); }}/>;
  } else if(route.name==='account'){
    screen = <AccountScreen user={user} onBack={()=>go({name:'home'})} onCategory={openCategory}
      onLogout={()=>{ saveUser(null); setUser(null); go({name:'home'}); }}/>;
  }

  // overlay de checkout/sucesso substitui a tela inteira
  if(overlay==='checkout'){
    screen = <CheckoutScreen cart={cart} onBack={()=>setOverlay(null)} onPlace={placeOrder} placing={placing}/>;
  } else if(overlay==='success' && lastOrder){
    screen = <SuccessScreen order={lastOrder} onHome={()=>{ setLastOrder(null); go({name:'home'}); }}/>;
  }

  return (
    <div className="lj-app">
      {screen}
      {overlay==='cart' && <CartDrawer cart={cart} onClose={()=>setOverlay(null)} setQty={setQty} removeItem={removeItem} onCheckout={()=>setOverlay('checkout')}/>}
      {overlay==='menu' && <MenuDrawer onClose={()=>setOverlay(null)} onCategory={openCategory} onAccount={openAccount} user={user}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ShopApp/>);
