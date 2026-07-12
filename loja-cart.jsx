/* ===== Axé de Quitéria — Loja: Carrinho ===== */

function CartDrawer({ cart, onClose, setQty, removeItem, onCheckout, onListing }) {
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const isEmpty = cart.length === 0;

  return (
    <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',justifyContent:'flex-end'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(44,30,20,.5)'}}/>
      <div style={{position:'relative',width:'min(420px,100%)',height:'100%',background:'var(--cream)',display:'flex',flexDirection:'column',boxShadow:'-12px 0 40px rgba(0,0,0,.2)'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 24px',borderBottom:'1px solid var(--line)',flexShrink:0}}>
          <span style={{fontFamily:"'Marcellus',serif",fontSize:24,color:'var(--ink)'}}>Seu carrinho</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'var(--muted)',lineHeight:1}}>×</button>
        </div>

        {/* Vazio */}
        {isEmpty && (
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:24,textAlign:'center'}}>
            <span style={{width:60,height:60,borderRadius:'50%',background:'var(--cream-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
            </span>
            <p style={{fontSize:16,color:'var(--muted)',margin:0}}>Seu carrinho está vazio</p>
            <button onClick={()=>{onClose();onListing();}} style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:'13px 26px',fontSize:15,fontWeight:700,cursor:'pointer'}}>Ver a loja</button>
          </div>
        )}

        {/* Itens */}
        {!isEmpty && (
          <>
            <div style={{flex:1,overflowY:'auto',padding:'16px 24px',display:'flex',flexDirection:'column',gap:16}}>
              {cart.map(it=>(
                <div key={it.id} style={{display:'flex',gap:14,alignItems:'center'}}>
                  {/* Thumbnail */}
                  <span style={{width:64,height:64,borderRadius:10,background:'repeating-linear-gradient(135deg,var(--cream-2) 0 8px,var(--cream-3) 8px 16px)',border:'1px solid var(--line)',flexShrink:0,position:'relative',display:'block'}}>
                    {it.photo
                      ? <img src={it.photo} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:10,display:'block'}}/>
                      : <span style={{position:'absolute',left:6,top:6,width:12,height:12,borderRadius:'50%',background:it.tone,display:'block'}}/>
                    }
                  </span>
                  <div style={{flex:1,minWidth:0}}>
                    <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:16,color:'var(--ink)'}}>{it.name}</span>
                    <span style={{display:'block',fontSize:12,color:'var(--muted)',marginTop:2}}>{it.orixa}</span>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
                      <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line)',borderRadius:999}}>
                        <button onClick={()=>it.qty>1?setQty(it.id,it.qty-1):removeItem(it.id)} style={{background:'none',border:'none',width:28,height:28,cursor:'pointer',fontSize:15,color:'var(--ink)'}}>−</button>
                        <span style={{width:22,textAlign:'center',fontSize:14,fontWeight:700}}>{it.qty}</span>
                        <button onClick={()=>setQty(it.id,it.qty+1)} style={{background:'none',border:'none',width:28,height:28,cursor:'pointer',fontSize:15,color:'var(--ink)'}}>+</button>
                      </div>
                      <button onClick={()=>removeItem(it.id)} style={{background:'none',border:'none',fontSize:12,color:'var(--muted)',cursor:'pointer',textDecoration:'underline',padding:0}}>remover</button>
                    </div>
                  </div>
                  <span style={{fontSize:15,fontWeight:700,color:'var(--ink)',whiteSpace:'nowrap'}}>{brl(it.price*it.qty)}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{borderTop:'1px solid var(--line)',padding:'20px 24px 24px',flexShrink:0}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:16}}>
                <span style={{fontSize:15,color:'var(--muted)'}}>Subtotal</span>
                <span style={{fontFamily:"'Marcellus',serif",fontSize:26,color:'var(--ink)'}}>{brl(subtotal)}</span>
              </div>
              <button onClick={onCheckout}
                style={{width:'100%',background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,padding:16,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer'}}>
                Finalizar compra
              </button>
              <button onClick={onClose}
                style={{width:'100%',background:'none',border:'none',color:'var(--muted)',fontSize:14,fontWeight:600,cursor:'pointer',marginTop:12}}>
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   CartScreen — full-page cart for mobile bottom tab navigation
   Renders same content as CartDrawer but inline (no overlay)
   ─────────────────────────────────────────────────────────── */
function CartScreen({ cart, setQty, removeItem, onCheckout, onListing }) {
  const subtotal = cart.reduce((s,it)=>s+it.price*it.qty,0);
  const isEmpty  = cart.length===0;

  return (
    <div className="lj-cart-page" style={{maxWidth:480,margin:'0 auto',padding:'0 0 20px'}}>

      {/* Empty state */}
      {isEmpty && (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          gap:16,padding:'60px 24px',textAlign:'center',minHeight:'50vh'}}>
          <span style={{width:64,height:64,borderRadius:'50%',background:'var(--cream-2)',
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6">
              <path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
            </svg>
          </span>
          <p style={{fontSize:17,color:'var(--muted)',margin:0,fontFamily:"'Marcellus',serif"}}>Sua sacola está vazia</p>
          <button onClick={onListing}
            style={{background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,
              padding:'14px 28px',fontSize:15,fontWeight:700,cursor:'pointer'}}>
            Ver a loja
          </button>
        </div>
      )}

      {/* Items */}
      {!isEmpty && (
        <>
          <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:14}}>
            {cart.map(it=>(
              <div key={it.id} style={{display:'flex',gap:14,alignItems:'center',
                padding:'14px',background:'var(--paper)',borderRadius:14,border:'1px solid var(--line)'}}>
                <span style={{width:60,height:60,borderRadius:10,
                  background:'repeating-linear-gradient(135deg,var(--cream-2) 0 8px,var(--cream-3) 8px 16px)',
                  border:'1px solid var(--line)',flexShrink:0,overflow:'hidden',display:'block'}}>
                  {it.photo&&<img src={it.photo} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{display:'block',fontFamily:"'Marcellus',serif",fontSize:15,color:'var(--ink)',
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.name}</span>
                  <span style={{display:'block',fontSize:12,color:'var(--muted)',marginTop:2}}>{it.orixa}</span>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
                    <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line)',borderRadius:999,overflow:'hidden'}}>
                      <button onClick={()=>it.qty>1?setQty(it.id,it.qty-1):removeItem(it.id)}
                        style={{background:'none',border:'none',width:30,height:30,cursor:'pointer',fontSize:16,color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                      <span style={{width:24,textAlign:'center',fontSize:14,fontWeight:700}}>{it.qty}</span>
                      <button onClick={()=>setQty(it.id,it.qty+1)}
                        style={{background:'none',border:'none',width:30,height:30,cursor:'pointer',fontSize:16,color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                    </div>
                    <button onClick={()=>removeItem(it.id)}
                      style={{background:'none',border:'none',fontSize:12,color:'var(--muted)',cursor:'pointer',textDecoration:'underline',padding:0}}>
                      remover
                    </button>
                  </div>
                </div>
                <span style={{fontSize:15,fontWeight:700,color:'var(--ink)',whiteSpace:'nowrap',flexShrink:0}}>{brl(it.price*it.qty)}</span>
              </div>
            ))}
          </div>

          {/* Summary + CTA */}
          <div style={{margin:'8px 16px 0',padding:'18px 20px',background:'var(--paper)',borderRadius:16,border:'1px solid var(--line)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
              <span style={{fontSize:14,color:'var(--muted)'}}>Subtotal</span>
              <span style={{fontFamily:"'Marcellus',serif",fontSize:24,color:'var(--ink)'}}>{brl(subtotal)}</span>
            </div>
            {subtotal>=200&&(
              <div style={{fontSize:12,color:'#2D7A3E',fontWeight:600,marginBottom:12,display:'flex',alignItems:'center',gap:5}}>
                <span>✓</span><span>Frete grátis para este pedido!</span>
              </div>
            )}
            <button onClick={onCheckout}
              style={{width:'100%',background:'var(--clay)',color:'#fff',border:'none',borderRadius:999,
                padding:16,fontFamily:"'Mulish',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer',
                marginTop:4}}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}

window.CartDrawer = CartDrawer;
window.CartScreen = CartScreen;
