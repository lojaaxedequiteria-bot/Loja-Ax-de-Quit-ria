/* ===== Axé de Quitéria — Loja: Carrinho, Checkout, Sucesso, Menu ===== */

/* ---------- CARRINHO (drawer) ---------- */
function CartDrawer({ cart, onClose, setQty, removeItem, onCheckout }) {
  const subtotal = cart.reduce((s, it) => s + it.preco * it.qty, 0);
  return (
    <>
      <div className="lj-scrim" onClick={onClose} />
      <div className="lj-drawer">
        <div className="lj-drawer-head">
          <div className="t">Seu carrinho {cart.length > 0 && <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-b)', fontSize: 14, fontWeight: 600 }}>({cart.reduce((s, i) => s + i.qty, 0)})</span>}</div>
          <div className="lj-iconbtn" onClick={onClose}><Icon name="close" size={20} /></div>
        </div>

        {cart.length === 0 ?
        <div className="lj-empty">
            <div className="i"><Icon name="cart" size={28} /></div>
            <div className="t">Carrinho vazio</div>
            <div className="s">Adicione guias e artigos do ateliê.</div>
            <button className="lj-btn primary" onClick={onClose}>Explorar a loja</button>
          </div> :

        <>
            <div className="lj-drawer-body">
              {cart.map((it) =>
            <div key={it.key} className="lj-cartitem">
                  <div className="img"><ProductImage product={it} variant="ring" /></div>
                  <div className="mid">
                    <div className="nm">{it.nome}</div>
                    {it.variantText && <div className="vr">{it.variantText}</div>}
                    <div className="pr">{brl(it.preco * it.qty)}</div>
                    <button className="lj-remove" onClick={() => removeItem(it.key)}><Icon name="close" size={13} /> Remover</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div className="lj-qty">
                      <button onClick={() => setQty(it.key, it.qty - 1)}><Icon name="minus" size={15} /></button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.key, it.qty + 1)}><Icon name="plus" size={15} /></button>
                    </div>
                  </div>
                </div>
            )}
              <div style={{ padding: '14px 0 4px' }}>
                <div className="lj-rowline"><span>Subtotal</span><span className="v">{brl(subtotal)}</span></div>
                <div className="lj-rowline" style={{ fontSize: 12.5, color: 'var(--ink-3)' }}><span>Frete</span><span>calculado no checkout</span></div>
              </div>
            </div>
            <div className="lj-drawer-foot">
              <div className="lj-rowline total" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Subtotal</span>
                <span className="v">{brl(subtotal)}</span>
              </div>
              <button className="lj-btn primary block lg" onClick={onCheckout}>
                Finalizar compra <Icon name="chevR" size={18} />
              </button>
            </div>
          </>
        }
      </div>
    </>);

}

/* ---------- CHECKOUT ---------- */
function CheckoutScreen({ cart, onBack, onPlace, placing }) {
  const subtotal = cart.reduce((s, it) => s + it.preco * it.qty, 0);
  const [form, setForm] = useState({ nome: '', email: '', tel: '', cep: '', rua: '', num: '', bairro: '', cidade: '', uf: 'BA' });
  const [ship, setShip] = useState(LJ_SHIPPING[1].id);
  const [pay, setPay] = useState('pix');
  const [card, setCard] = useState({ num:'', nome:'', val:'', cvv:'', parcelas:'1' });
  const setC = (k) => (e) => setCard({ ...card, [k]: e.target.value });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const shipObj = LJ_SHIPPING.find((s) => s.id === ship);
  const total = subtotal + (shipObj ? shipObj.value : 0);
  const enderecoOk = ship === 'retirada' || form.cep.trim() && form.rua.trim() && form.num.trim() && form.cidade.trim();
  const pagamentoOk = pay !== 'card' || (card.num.trim().length >= 12 && card.nome.trim() && card.val.trim() && card.cvv.trim());
  const valid = form.nome.trim() && form.tel.trim() && enderecoOk && pagamentoOk;

  const PAYS = [
  { id: 'pix', ico: 'pix', nm: 'PIX', sub: 'Aprovação na hora · 5% off' },
  { id: 'card', ico: 'card', nm: 'Cartão de crédito', sub: 'Em até 6x sem juros' },
  { id: 'whats', ico: 'whats', nm: 'Combinar pelo WhatsApp', sub: 'Atendimento do ateliê' }];

  const payDiscount = pay === 'pix' ? subtotal * 0.05 : 0;
  const grand = total - payDiscount;
  const parcelaVal = grand / parseInt(card.parcelas || '1');

  return (
    <>
      <Header onBack={onBack} title="Finalizar compra" />
      <div className="lj-scroll lj-fade">
        <div style={{ padding: '18px 18px 0' }}>
          {/* dados */}
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 19, marginBottom: 14 }}>Seus dados</div>
          <div className="lj-field"><label>Nome completo</label><input className="lj-input" value={form.nome} onChange={set('nome')} placeholder="Como no documento" /></div>
          <div className="lj-row2">
            <div className="lj-field"><label>WhatsApp</label><input className="lj-input" value={form.tel} onChange={set('tel')} placeholder="(71) 9...." inputMode="tel" /></div>
            <div className="lj-field"><label>E-mail</label><input className="lj-input" value={form.email} onChange={set('email')} placeholder="opcional" inputMode="email" /></div>
          </div>

          {/* entrega */}
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 19, margin: '24px 0 14px' }}>Entrega</div>
          {LJ_SHIPPING.map((s) =>
          <div key={s.id} className={'lj-ship' + (ship === s.id ? ' on' : '')} onClick={() => setShip(s.id)}>
              <div className="radio" />
              <div className="mid"><div className="nm">{s.label}</div><div className="sub">{s.sub} · {s.prazo}</div></div>
              <div className="pr">{s.value === 0 ? 'Grátis' : brl(s.value)}</div>
            </div>
          )}

          {/* endereço */}
          {ship !== 'retirada' &&
          <div style={{ marginTop: 6 }}>
              <div className="lj-row2">
                <div className="lj-field" style={{ flex: '0 0 40%' }}><label>CEP</label><input className="lj-input" value={form.cep} onChange={set('cep')} placeholder="00000-000" inputMode="numeric" /></div>
                <div className="lj-field"><label>Cidade</label><input className="lj-input" value={form.cidade} onChange={set('cidade')} placeholder="Porto Alegre" /></div>
              </div>
              <div className="lj-field"><label>Rua / logradouro</label><input className="lj-input" value={form.rua} onChange={set('rua')} placeholder="Rua, avenida..." /></div>
              <div className="lj-row2">
                <div className="lj-field" style={{ flex: '0 0 32%' }}><label>Número</label><input className="lj-input" value={form.num} onChange={set('num')} placeholder="nº" inputMode="numeric" /></div>
                <div className="lj-field"><label>Bairro</label><input className="lj-input" value={form.bairro} onChange={set('bairro')} placeholder="Bairro" /></div>
              </div>
            </div>
          }

          {/* pagamento */}
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 19, margin: '24px 0 14px' }}>Pagamento</div>
          {PAYS.map((o) =>
          <div key={o.id}>
            <div className={'lj-pay' + (pay === o.id ? ' on' : '')} onClick={() => setPay(o.id)}>
              <div className="i"><Icon name={o.ico} size={20} /></div>
              <div className="mid"><div className="nm">{o.nm}</div><div className="sub">{o.sub}</div></div>
              <div className="radio" />
            </div>
            {pay === o.id && o.id === 'pix' &&
            <div className="lj-paypanel">
              <div className="lj-qr"><Icon name="pix" size={40} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-2)' }}>Chave PIX do ateliê</div>
                <div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 15, margin: '3px 0 8px', wordBreak: 'break-all' }}>{LJ_STORE.pix}</div>
                <div style={{ fontSize: 12, color: 'var(--olive)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="check" size={14} /> 5% de desconto aplicado</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.45 }}>Após confirmar, o QR Code e o código copia-e-cola chegam no seu WhatsApp.</div>
              </div>
            </div>}
            {pay === o.id && o.id === 'card' &&
            <div className="lj-paypanel col">
              <div className="lj-field" style={{ marginBottom: 11 }}><label>Número do cartão</label><input className="lj-input" value={card.num} onChange={setC('num')} placeholder="0000 0000 0000 0000" inputMode="numeric" /></div>
              <div className="lj-field" style={{ marginBottom: 11 }}><label>Nome impresso no cartão</label><input className="lj-input" value={card.nome} onChange={setC('nome')} placeholder="Como está no cartão" /></div>
              <div className="lj-row2">
                <div className="lj-field"><label>Validade</label><input className="lj-input" value={card.val} onChange={setC('val')} placeholder="MM/AA" inputMode="numeric" /></div>
                <div className="lj-field"><label>CVV</label><input className="lj-input" value={card.cvv} onChange={setC('cvv')} placeholder="123" inputMode="numeric" /></div>
              </div>
              <div className="lj-field" style={{ marginBottom: 0 }}><label>Parcelas</label>
                <select className="lj-input" value={card.parcelas} onChange={setC('parcelas')}>
                  {[1,2,3,4,5,6].map((p) => <option key={p} value={p}>{p}x de {brl(grand / p)}{p === 1 ? ' à vista' : ' sem juros'}</option>)}
                </select>
              </div>
            </div>}
            {pay === o.id && o.id === 'whats' &&
            <div className="lj-paypanel">
              <span style={{ color: 'var(--olive)', flexShrink: 0 }}><Icon name="whats" size={26} /></span>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>Ao confirmar, abriremos uma conversa no WhatsApp do ateliê com o resumo do pedido para combinar o pagamento.</div>
            </div>}
          </div>
          )}

          {/* resumo */}
          <div style={{ marginTop: 22, padding: '16px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--ink-2)' }}>Resumo do pedido</div>
            {cart.map((it) =>
            <div key={it.key} className="lj-rowline" style={{ padding: '4px 0', fontSize: 13 }}>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.qty}× {it.nome}</span>
                <span className="v" style={{ fontSize: 13 }}>{brl(it.preco * it.qty)}</span>
              </div>
            )}
            <div className="lj-rowline" style={{ padding: '6px 0', fontSize: 13.5 }}><span>Subtotal</span><span className="v" style={{ fontSize: 13.5 }}>{brl(subtotal)}</span></div>
            <div className="lj-rowline" style={{ padding: '4px 0', fontSize: 13.5 }}><span>Frete ({shipObj.label})</span><span className="v" style={{ fontSize: 13.5 }}>{shipObj.value === 0 ? 'Grátis' : brl(shipObj.value)}</span></div>
            {payDiscount > 0 && <div className="lj-rowline" style={{ padding: '4px 0', fontSize: 13.5, color: 'var(--olive)' }}><span>Desconto PIX (5%)</span><span style={{ fontWeight: 700 }}>−{brl(payDiscount)}</span></div>}
            <div className="lj-rowline total"><span style={{ fontWeight: 700 }}>Total</span><span className="v">{brl(grand)}</span></div>
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>

      <div className="lj-buybar">
        <div className="price"><div className="l">Total</div><div className="v">{brl(grand)}</div></div>
        <button className="lj-btn primary block lg" style={{ flex: 1, opacity: valid ? 1 : .5, pointerEvents: valid ? 'auto' : 'none' }}
        onClick={() => onPlace({ form, ship: shipObj, pay, card, subtotal, total: grand })} disabled={placing}>
          {placing ? <><span className="spin" /> Processando…</> : <>Confirmar pedido <Icon name="check" size={18} /></>}
        </button>
      </div>
    </>);

}

/* ---------- SUCESSO ---------- */
function SuccessScreen({ order, onHome }) {
  return (
    <>
      <Header title="Pedido confirmado" />
      <div className="lj-success lj-fade">
        <div className="lj-success-ring"><Icon name="check" size={44} /></div>
        <h2>Axé! Seu pedido<br />foi confirmado</h2>
        <p>Obrigada por confiar no nosso ateliê. Estamos preparando sua encomenda com todo cuidado e fundamento.</p>
        <div className="lj-order-num">Pedido {order.numero}</div>
        <div style={{ fontSize: 12.5, color: 'var(--olive)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}><Icon name="check" size={15} /> Resumo enviado ao WhatsApp do ateliê</div>
        <div style={{ width: '100%', maxWidth: 340, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 16, textAlign: 'left', marginBottom: 24 }}>
          <div className="lj-rowline" style={{ padding: '5px 0', fontSize: 13.5 }}><span>Total pago</span><span className="v" style={{ fontSize: 14 }}>{brl(order.total)}</span></div>
          <div className="lj-rowline" style={{ padding: '5px 0', fontSize: 13.5 }}><span>Entrega</span><span className="v" style={{ fontSize: 13.5 }}>{order.ship.label}</span></div>
          <div className="lj-rowline" style={{ padding: '5px 0', fontSize: 13.5 }}><span>Prazo</span><span className="v" style={{ fontSize: 13.5 }}>{order.ship.prazo}</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, width: '100%', maxWidth: 340 }}>
          <a className="lj-btn gold block lg" href={order.wa || ('https://wa.me/' + LJ_STORE.whatsapp)} target="_blank" rel="noreferrer"><Icon name="whats" size={19} /> Acompanhar pelo WhatsApp</a>
          <button className="lj-btn ghost block" onClick={onHome}>Voltar à loja</button>
        </div>
      </div>
    </>);

}

/* ---------- MENU (drawer esquerda) ---------- */
function MenuDrawer({ onClose, onCategory, onAccount, user }) {
  const tints = (window.CAT_TINTS) || { guias: { bg: 'var(--clay-soft)', fg: 'var(--clay)' } };
  return (
    <>
      <div className="lj-scrim" onClick={onClose} />
      <div className="lj-drawer left" style={{ maxWidth: 330 }}>
        <div className="lj-drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <img src="assets/logo-circ.png" alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div><div style={{ fontFamily: 'var(--font-d)', fontWeight: 600, fontSize: 17, lineHeight: 1 }}>Axé de Quitéria</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{LJ_STORE.cidade}</div></div>
          </div>
          <div className="lj-iconbtn" onClick={onClose}><Icon name="close" size={20} /></div>
        </div>
        <div className="lj-drawer-body">
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: '12px 4px 4px' }}>Categorias</div>
          <div className="lj-menu-item" onClick={() => onCategory('all')}>
            <div className="i" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}><Icon name="bag" size={20} /></div>
            <div style={{ flex: 1 }}><div className="nm">Todos os produtos</div><div className="sub">A coleção completa</div></div>
            <Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />
          </div>
          {LJ_CATEGORIES.map((c) => {const t = tints[c.id] || { bg:'var(--paper-2)', fg:'var(--clay)' };return (
              <div key={c.id} className="lj-menu-item" onClick={() => onCategory(c.id)}>
              <div className="i" style={{ background: t.bg, color: t.fg }}><Icon name={c.icon} size={20} /></div>
              <div style={{ flex: 1 }}><div className="nm">{c.name}</div><div className="sub">{c.desc}</div></div>
              <Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} />
            </div>);
          })}
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: '20px 4px 4px' }}>Ateliê</div>
          <div className="lj-menu-item" onClick={onAccount}><div className="i" style={{ background: 'var(--clay-soft)', color: 'var(--clay)' }}><Icon name="user" size={20} /></div><div style={{ flex: 1 }}><div className="nm">{user ? 'Minha conta' : 'Entrar / criar conta'}</div><div className="sub">{user ? user.nome : 'Acompanhe seus pedidos'}</div></div><Icon name="chevR" size={18} style={{ color: 'var(--ink-3)' }} /></div>
          <a className="lj-menu-item" href={'https://wa.me/' + LJ_STORE.whatsapp} target="_blank" rel="noreferrer" style={{ borderBottom: 'none', textDecoration: 'none', color: 'inherit' }}><div className="i" style={{ background: 'var(--olive-soft)', color: 'var(--olive)' }}><Icon name="whats" size={20} /></div><div style={{ flex: 1 }}><div className="nm">Falar com o ateliê</div><div className="sub">WhatsApp · {LJ_STORE.cidade}</div></div></a>
        </div>
        <div className="lj-drawer-foot" style={{ background: 'var(--paper)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Feito à mão com axé em {LJ_STORE.cidade.split(',')[0]} 🤲🏾</div>
        </div>
      </div>
    </>);

}

Object.assign(window, { CartDrawer, CheckoutScreen, SuccessScreen, MenuDrawer });