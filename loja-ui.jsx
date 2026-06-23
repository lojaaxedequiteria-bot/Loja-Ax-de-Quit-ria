/* ===== Axé de Quitéria — Loja: UI base ===== */
const { useState, useMemo, useRef, useEffect } = React;

const brl = (n)=> 'R$ ' + (n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

/* ---- ícones (stroke, geométrico) ---- */
const _p = (d,k)=> React.createElement('path',{d,key:k,fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'});
const LJ_ICONS = {
  menu:   ['M4 7h16','M4 12h16','M4 17h16'],
  cart:   ['M5 7h14l-1.4 9.5a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 7z','M8.5 7a3.5 3.5 0 0 1 7 0','M9 21a1 1 0 1 0 0-.01z','M15 21a1 1 0 1 0 0-.01z'],
  bag:    ['M6 8h12l-1 12H7z','M9 8a3 3 0 0 1 6 0'],
  search: ['M11 11a5 5 0 1 0-.01-.01z','M15 15l4 4'],
  plus:   ['M12 5v14','M5 12h14'],
  minus:  ['M5 12h14'],
  check:  ['M5 12.5l4.5 4.5L19 7'],
  chevR:  ['M9 5l7 7-7 7'],
  chevL:  ['M15 5l-7 7 7 7'],
  close:  ['M6 6l12 12','M18 6 6 18'],
  star:   ['M12 3.5l2.6 5.7 6 .6-4.5 4 1.3 6L12 17.7 6.6 19.8l1.3-6-4.5-4 6-.6z'],
  zoom:   ['M11 11a5 5 0 1 0-.01-.01z','M15 15l4 4','M11 9v4','M9 11h4'],
  guia:   ['M6 5c0 6 2.7 10 6 10s6-4 6-10','M12 15v3.2','M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  beads:  ['M4.5 9c2.5 0 2.5 3 5 3s2.5-3 5-3 2.5 3 5 3','M4.5 15c2.5 0 2.5-3 5-3','M19.5 15c-2.5 0-2.5-3-5-3','M6.7 8.8a.7.7 0 1 0 0-.01z','M12 12a.8.8 0 1 0 0-.01z','M17.3 8.8a.7.7 0 1 0 0-.01z'],
  candle: ['M9 9.5h6v9.5H9z','M9.5 19.2h5','M12 9.5V6','M12 6c0-1.4-1.3-1.8-1.3-3C10.7 1.9 12 1.2 12 1.2s1.3.7 1.3 1.8c0 1.2-1.3 1.6-1.3 3z'],
  bracelet:['M5 12a7 7 0 1 0 14 0','M5 12a7 7 0 0 1 14 0','M9.2 5.2l.8 2M14.8 5.2l-.8 2','M12 4.4V6.6','M7 18.5l1-1.6M17 18.5l-1-1.6'],
  bangle: ['M12 21a9 7 0 1 0 0-14 9 7 0 0 0 0 14z','M12 18.2a6 4.2 0 1 0 0-8.4 6 4.2 0 0 0 0 8.4z','M12 4.5V7','M9.5 5l.6 2.1','M14.5 5l-.6 2.1'],
  patua:  ['M8.5 8.2 7 5.8a1 1 0 0 1 .9-1.5h8.2a1 1 0 0 1 .9 1.5l-1.5 2.4','M6 8.2h12l-1 9.8a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8z','M12 12v3.2','M12 12a1.4 1.4 0 1 0 0-.01z'],
  shirt:  ['M8 3 4 6l2 2.5L8 7v14h8V7l2 1.5L20 6l-4-3-2 2h-4z'],
  hat:    ['M3 17c2-1 5-1.5 9-1.5s7 .5 9 1.5','M6.5 16.5 8 5.5c.2-1.4 1.4-2.5 2.8-2.5h2.4c1.4 0 2.6 1.1 2.8 2.5l1.5 11','M9.5 19.5c1.6.4 3.4.4 5 0'],
  tool:   ['M14.5 6a3.5 3.5 0 0 0-4.6 4.3L4 16.2 6.8 19l5.9-5.9A3.5 3.5 0 0 0 17 8.5l-2 2-1.5-1.5 2-2A3.5 3.5 0 0 0 14.5 6z'],
  leaf:   ['M5 19c0-8 5-13 14-14 0 9-4 14-14 14z','M5 19c2-4 5-7 9-9'],
  heart:  ['M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z'],
  truck:  ['M3 7h11v9H3z','M14 10h4l3 3v3h-7z','M7.5 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z','M17.5 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z'],
  shield: ['M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z','M9 12l2 2 4-4'],
  spark:  ['M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z'],
  hand:   ['M7 11V6.5a1.5 1.5 0 0 1 3 0V11','M10 11V5a1.5 1.5 0 0 1 3 0v6','M13 11V6.5a1.5 1.5 0 0 1 3 0V13c0 3.5-2 6-5 6h-1c-2 0-3-1-4.5-3L4 12.5a1.5 1.5 0 0 1 2.3-1.9L7 11.5'],
  pix:    ['M12 3l4.5 4.5L12 12 7.5 7.5z','M12 12l4.5 4.5L12 21l-4.5-4.5z','M3 12l4.5-4.5L12 12l-4.5 4.5z','M21 12l-4.5-4.5','M21 12l-4.5 4.5'],
  card:   ['M3 6.5h18v11H3z','M3 10h18','M6 14h4'],
  whats:  ['M12 3a8.5 8.5 0 0 0-7.3 12.8L3.5 21l5.4-1.4A8.5 8.5 0 1 0 12 3z','M8.8 8.4c.6 2.2 2.6 4.2 4.8 4.8.7.2 1.2-.1 1.5-.6l.3-.6 1.6.8c0 .9-.7 1.7-1.6 1.8-2.9.2-6.6-3.5-6.4-6.4.1-.9.9-1.6 1.8-1.6l.8 1.6-.6.3c-.5.3-.8.8-.5 1.5z'],
  pin:    ['M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z','M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  flame:  ['M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-1.2.4-2.3 1-3.3.6 1 1.5 1.6 2.2 1.3C9.6 9 10 6.5 12 3z'],
  user:   ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z','M5 20a7 7 0 0 1 14 0'],
};
function Icon({ name, size=22, stroke=1.7, style }){
  const paths = LJ_ICONS[name] || LJ_ICONS.bag;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths.map((d,i)=>React.createElement('path',{d,key:i,fill:'none',stroke:'currentColor',strokeWidth:stroke,strokeLinecap:'round',strokeLinejoin:'round'}))}
    </svg>
  );
}

/* ---- Imagem do produto: foto real (quando disponível) ou animação de contas ---- */
function ProductImage({ product, variant='ring', bare=false, children }){
  // Foto real do estoque → mostra como imagem de capa
  if(product.photo && !bare){
    return (
      <div style={{position:'absolute',inset:0,background:'#F3EADB',overflow:'hidden'}}>
        <img src={product.photo} alt={product.nome||''}
          style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        {children}
      </div>
    );
  }
  const cores = product.cores || ['#C9A24B','#E8C86B','#9A6B3F'];
  const tom = product.tom || '#F3EADB';
  const N = 22;
  const beads = [];
  for(let i=0;i<N;i++){
    const a = (i/N)*Math.PI*2 - Math.PI/2;
    const R = 33;                 // % radius
    const cx = 50 + R*Math.cos(a);
    const cy = 50 + R*Math.sin(a);
    const col = cores[i % cores.length];
    const big = (i===Math.round(N/2)); // pingente embaixo
    beads.push(
      <div key={i} style={{
        position:'absolute', left:cx+'%', top:cy+'%',
        width:big?'15%':'10.5%', aspectRatio:'1/1', borderRadius:'50%',
        transform:'translate(-50%,-50%)',
        background:`radial-gradient(circle at 32% 28%, #ffffffcc, ${col} 46%, ${shade(col,-18)} 100%)`,
        boxShadow:'0 1px 2px rgba(42,33,27,.22)',
      }}/>
    );
  }
  // strand: fios paralelos | pendant: foco numa conta grande
  let inner;
  if(variant==='strand'){
    inner = (
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',gap:'9%'}}>
        {[0,1,2].map(col=>(
          <div key={col} style={{display:'flex',flexDirection:'column',gap:'5%'}}>
            {Array.from({length:9}).map((_,i)=>(
              <div key={i} style={{width:18,height:18,borderRadius:'50%',
                background:`radial-gradient(circle at 32% 28%, #ffffffcc, ${cores[(i+col)%cores.length]} 46%, ${shade(cores[(i+col)%cores.length],-18)} 100%)`,
                boxShadow:'0 1px 2px rgba(42,33,27,.2)'}}/>
            ))}
          </div>
        ))}
      </div>
    );
  } else if(variant==='pendant'){
    inner = (
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:'46%',aspectRatio:'1/1',borderRadius:'50%',
          background:`radial-gradient(circle at 34% 30%, #ffffffe0, ${cores[0]} 44%, ${shade(cores[0],-22)} 100%)`,
          boxShadow:'0 6px 18px rgba(42,33,27,.25), inset 0 -6px 14px rgba(0,0,0,.12)'}}/>
      </div>
    );
  } else {
    inner = <div style={{position:'absolute',inset:0}}>{beads}</div>;
  }
  return (
    <div style={{position:'absolute',inset:0,
      background: bare ? 'transparent' : `radial-gradient(120% 100% at 50% 18%, #fff 0%, ${tom} 62%, ${shade(tom,-8)} 100%)`}}>
      {!bare && <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(42,33,27,.04) 1px, transparent 1px)',backgroundSize:'14px 14px'}}/>}
      {inner}
      {children}
    </div>
  );
}

/* escurece/clareia um hex */
function shade(hex, pct){
  const h = hex.replace('#',''); const n = parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
  let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.max(0,Math.min(255,Math.round(r+r*pct/100)));
  g=Math.max(0,Math.min(255,Math.round(g+g*pct/100)));
  b=Math.max(0,Math.min(255,Math.round(b+b*pct/100)));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

function Stars({ value, size=13 }){
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:2,color:'var(--gold)'}}>
      <Icon name="star" size={size} stroke={1.6} style={{fill:'currentColor'}}/>
      <b style={{color:'var(--ink-2)',fontWeight:700}}>{value.toFixed(1)}</b>
    </span>
  );
}

Object.assign(window, { brl, Icon, ProductImage, shade, Stars, useState, useMemo, useRef, useEffect });
