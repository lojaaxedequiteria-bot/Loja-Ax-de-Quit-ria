/* ===== Axé de Quitéria — Loja: Página de Produto (PDP) ===== */
function ProductScreen({ product, onBack, onCart, cartCount, onAddToCart, onBuyNow }){
  const p = product;
  const views = ['ring','strand','pendant'];
  const [view,setView] = useState('ring');
  const [zoom,setZoom] = useState(false);
  const [zPos,setZPos] = useState({x:50,y:50});
  // estado das variantes (1ª opção por padrão)
  const [sel,setSel] = useState(()=>{
    const o={}; (p.variantes||[]).forEach(v=>o[v.label]=v.options[0]); return o;
  });
  const off = p.preco_antigo ? Math.round((1-p.preco/p.preco_antigo)*100) : 0;

  function moveZoom(e){
    const r = e.currentTarget.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    setZPos({ x:((t.clientX-r.left)/r.width)*100, y:((t.clientY-r.top)/r.height)*100 });
  }
  const variantText = Object.values(sel).join(' · ');

  return (
    <>
      <Header onBack={onBack} onCart={onCart} cartCount={cartCount}/>
      <div className="lj-scroll">
        {/* galeria */}
        <div className="lj-pdp-gallery lj-fade"
          onMouseDown={()=>setZoom(true)} onMouseUp={()=>setZoom(false)} onMouseLeave={()=>setZoom(false)} onMouseMove={(e)=>zoom&&moveZoom(e)}
          onTouchStart={(e)=>{setZoom(true);moveZoom(e);}} onTouchEnd={()=>setZoom(false)} onTouchMove={moveZoom}
          style={{cursor:zoom?'zoom-out':'zoom-in'}}>
          <div style={{position:'absolute',inset:0,transform:zoom?`scale(2)`:'scale(1)',transformOrigin:`${zPos.x}% ${zPos.y}%`,transition:zoom?'none':'transform .3s'}}>
            <ProductImage product={p} variant={view}/>
          </div>
          {p.badge && <span className="lj-pbadge" style={{top:14,left:14}}>{p.badge}</span>}
          <div className="lj-pdp-zoomhint"><Icon name="zoom" size={14}/> Segure para ampliar</div>
        </div>

        {/* thumbs */}
        <div className="lj-thumbs">
          {views.map(v=>(
            <div key={v} className={'lj-thumb-sel'+(view===v?' on':'')} onClick={()=>setView(v)}>
              <ProductImage product={p} variant={v}/>
            </div>
          ))}
        </div>

        {/* corpo */}
        <div className="lj-pdp-body lj-fade">
          {p.orixa && <div style={{fontSize:12,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--clay)',marginBottom:7}}>{p.orixa}</div>}
          <div className="lj-pdp-title">{p.nome}</div>
          <div style={{marginTop:8}}><Stars value={p.avaliacao} size={15}/> <span style={{fontSize:13,color:'var(--ink-3)',marginLeft:4}}>{p.num_avaliacoes} avaliações</span></div>

          <div className="lj-pdp-price">
            <span className="now">{brl(p.preco)}</span>
            {p.preco_antigo && <span className="old">{brl(p.preco_antigo)}</span>}
            {off>0 && <span className="off">−{off}%</span>}
          </div>

          {/* variantes */}
          {(p.variantes||[]).map(v=>(
            <div key={v.label} className="lj-variant">
              <div className="lj-variant-lab"><span>{v.label}</span><b>{sel[v.label]}</b></div>
              <div className="lj-chips">
                {v.options.map(o=>(
                  <button key={o} className={'lj-chip'+(sel[v.label]===o?' on':'')}
                    onClick={()=>setSel({...sel,[v.label]:o})}>{o}</button>
                ))}
              </div>
            </div>
          ))}

          {/* fundamento */}
          <div className="lj-fund">
            <div className="h"><span className="i"><Icon name="flame" size={17}/></span> O fundamento</div>
            <p>{p.fundamento}</p>
          </div>

          <p style={{fontSize:14.5,lineHeight:1.65,color:'var(--ink-2)',marginTop:20}}>{p.descricao}</p>

          {/* materiais */}
          <div className="lj-mats">
            <div className="lj-mats-h">Materiais</div>
            <div>
              {p.materiais.map((m,i)=>(
                <span key={i} className="lj-mat"><span className="dot" style={{background:p.cores[i%p.cores.length]}}/>{m}</span>
              ))}
            </div>
          </div>

          {/* selos */}
          <div style={{marginTop:24}}>
            <div className="lj-detail-row"><span className="i"><Icon name="hand" size={19}/></span><div><div className="t">Feito à mão no ateliê</div><div className="s">Cada peça é única, montada conta por conta</div></div></div>
            <div className="lj-detail-row"><span className="i"><Icon name="shield" size={19}/></span><div><div className="t">Consagrada com respeito</div><div className="s">Fundamento da tradição preservado</div></div></div>
            <div className="lj-detail-row" style={{borderBottom:'none'}}><span className="i"><Icon name="truck" size={19}/></span><div><div className="t">Envio cuidadoso</div><div className="s">Embalagem protegida para todo o Brasil</div></div></div>
          </div>
        </div>
        <div style={{height:24}}/>
      </div>

      {/* barra de compra fixa */}
      <div className="lj-buybar">
        <div className="price">
          <div className="l">Total</div>
          <div className="v">{brl(p.preco)}</div>
        </div>
        <button className="lj-btn ghost" style={{flexShrink:0,padding:'14px 18px'}} onClick={()=>onAddToCart(p,sel)}>
          <Icon name="cart" size={19}/>
        </button>
        <button className="lj-btn primary block" style={{flex:1}} onClick={()=>onBuyNow(p,sel)}>Comprar agora</button>
      </div>
    </>
  );
}

window.ProductScreen = ProductScreen;
