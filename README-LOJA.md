# Handoff — Loja Axé de Quitéria (E-commerce)
> **Versão:** Junho 2026 · App de venda para o cliente final (B2C)
> Complementa o app de **gestão** (pasta raiz do handoff). Mesma marca, mesmo banco Supabase.

## O que é

E-commerce **mobile-first** premium do ateliê. O cliente navega a vitrine, abre produtos, monta o carrinho, faz checkout e o pedido **cai no WhatsApp da loja** + grava no Supabase (tabela `pedidos`, a mesma que a gestão lê). Catálogo vem da tabela `produtos`; clientes podem criar conta.

## Como rodar o protótipo
Sirva a pasta `loja/` por HTTP (`npx serve loja` ou `python3 -m http.server`) e abra `Loja.html`. São arquivos React+Babel no navegador (sem build) — referência de design + protótipo funcional. **Recriar em produção** com Next.js + TS + Tailwind + Supabase.

---

## 1. Arquivos (pasta `loja/`)

| Arquivo | Conteúdo |
|---|---|
| `Loja.html` | Entrada — fontes, container mobile, ordem dos scripts |
| `loja.css` | Estilos premium (`.lj-*`) sobre os tokens da marca |
| `loja-data.js` | **Mock do catálogo** — espelha tabelas `produtos`, categorias, frete e dados da loja (`LJ_STORE`) |
| `loja-ui.jsx` | Base — `Icon` (SVG inline), `ProductImage` (placeholder de contas, prop `bare`), `Stars`, `brl`, `shade` |
| `loja-home.jsx` | `HomeScreen`, `HeroVitrine` (carrossel rotativo), `CategoryCarousel` (setas), `ProductCard`, `Header`, `CategoryScreen` |
| `loja-product.jsx` | `ProductScreen` (PDP) — galeria com zoom, variantes, fundamento, materiais, barra de compra |
| `loja-auth.jsx` | `AuthScreen` (login/cadastro), `AccountScreen` (conta logada), `loadUser`/`saveUser` |
| `loja-cart.jsx` | `CartDrawer`, `CheckoutScreen` (endereço, frete, PIX/cartão), `SuccessScreen`, `MenuDrawer` |
| `loja-app.jsx` | `ShopApp` — roteamento, estado do carrinho (persistido), `placeOrder` + `buildWhatsMsg` |
| `assets/logo-circ.png` | Logo circular da marca |

---

## 2. Telas e fluxo

1. **Home** — header (menu, logo, conta, carrinho); **HeroVitrine** rotativo (4 slides com frase de venda, preço e CTA, troca a cada 4,5s, setas + dots, pausa no hover); **CategoryCarousel** com setas dos dois lados; grid de **Destaques**; faixa de confiança.
2. **Categoria** (`CategoryScreen`) — lista filtrada; `'all'` mostra tudo.
3. **Produto** (`ProductScreen`) — galeria com **zoom** (segurar), 3 ângulos, preço/desconto, **variantes** (chips), bloco "O fundamento", materiais, selos; barra fixa "Comprar agora" + add ao carrinho.
4. **Carrinho** (`CartDrawer`) — itens, quantidade, remover, subtotal, ir ao checkout.
5. **Checkout** (`CheckoutScreen`) — dados do cliente; **frete** (Retirada/SEDEX/Expressa); endereço; **pagamento**: PIX (chave + 5% off), Cartão (formulário + parcelas até 6x), ou combinar por WhatsApp; resumo + total.
6. **Sucesso** (`SuccessScreen`) — número do pedido, resumo, botão WhatsApp.
7. **Conta** — `AuthScreen` (entrar/criar) e `AccountScreen` (perfil, pedidos, favoritos, endereços, sair).

---

## 3. Modelo de dados (Supabase)

### Tabela `produtos` (lida pela vitrine — campos em `LJ_PRODUCTS`)
```ts
interface Produto {
  id: string; nome: string; slug: string;
  categoria: 'guias'|'fios'|'ferramentas'|'pulseiras'|'braceletes'|'patua'|'vestuario'|'chapeus'|'banhos';
  preco: number; preco_antigo: number|null;
  destaque: boolean; badge: string|null;       // 'Mais vendida' | 'Oferta' | 'Novo' | 'Premium' | 'Artesanal'
  orixa: string|null;
  cores: string[];                               // motivo visual do placeholder (trocar por imagens reais)
  tom: string;                                   // cor de fundo do placeholder
  avaliacao: number; num_avaliacoes: number; estoque: number;
  materiais: string[]; fundamento: string; descricao: string;
  variantes: { label: string; options: string[] }[];
  // PRODUÇÃO: adicionar imagens: string[] (URLs do Supabase Storage)
}
```

### Tabela `pedidos` (INSERT no checkout — mesma da gestão)
O `placeOrder` em `loja-app.jsx` tem o stub marcado:
```ts
await supabase.from('pedidos').insert({
  numero, cliente: payload.form, cliente_id: user?.id,
  itens: cart, frete: payload.ship, pagamento: payload.pay,
  total: payload.total, status: 'producao', origem: 'loja'
})
```
> A gestão já lê `pedidos` na tela Pedidos. Use `status:'producao'` para a venda entrar no fluxo do ateliê.

### Tabela `clientes` (auth — em `loja-auth.jsx`)
```ts
interface Cliente { id; nome; email; tel; since }
// signup → supabase.auth.signUp + insert em `clientes`
// login  → supabase.auth.signInWithPassword
```

### Dados da loja (`LJ_STORE` em `loja-data.js`)
`nome, cidade (Porto Alegre, RS), endereco, whatsapp (55DDD…), pix, instagram`.
⚠️ **WhatsApp está com número de exemplo `5551998765432`** — substituir pelo real.

---

## 4. Integrações a implementar

- **Catálogo:** `LJ_PRODUCTS` → `select` em `produtos` (filtrar por categoria, destaque).
- **Imagens:** hoje `ProductImage` desenha um placeholder de contas. Em produção, renderizar `<img>` das URLs do Storage; manter o componente só como fallback.
- **Checkout → pedido:** `insert` em `pedidos` (ver §3) **antes** de abrir o WhatsApp.
- **WhatsApp automático:** `buildWhatsMsg()` monta `https://wa.me/<num>?text=<resumo>` e `placeOrder` faz `window.open`. Manter — funciona em produção sem backend.
- **Auth:** Supabase Auth (e-mail/senha ou OTP por WhatsApp). Substituir `loadUser/saveUser` (localStorage) por sessão Supabase.
- **Frete:** `LJ_SHIPPING` é fixo; integrar cálculo por CEP (Correios/Melhor Envio) no backend.
- **Pagamento:** PIX e cartão estão como UI. Integrar gateway (Mercado Pago, Pagar.me, Stripe) — gerar QR PIX real e tokenizar cartão (nunca trafegar PAN cru).

---

## 5. Passos sugeridos (Claude Code)
1. Scaffold Next.js + TS + Tailwind; instalar `@supabase/supabase-js`.
2. Portar tokens de `loja.css` (cores/fontes já batem com a gestão — ver README raiz §6) e os componentes de `loja-ui.jsx`.
3. Páginas: `/` (Home), `/c/[cat]`, `/p/[slug]`, `/checkout`, `/conta`. Carrinho em context/Zustand (persist).
4. Conectar `produtos` (SSR/ISR) e `pedidos` (server action no checkout).
5. Supabase Auth + tabela `clientes`.
6. Gateway de pagamento + frete por CEP.
7. Imagens reais no Storage.
8. SEO (metadata, OG), PWA opcional.

---

## 6. Identidade visual
Mesma da gestão: terroso + sagrado. Terracota `#B0542F` primária, oliva `#566B49`, dourado `#B0892E`; papel `#FAF5EC`. Títulos **Spectral**, UI **Hanken Grotesk**. Tokens completos no README da pasta raiz (§6). Sensação: alto padrão, respeito, cuidado artesanal, sagrado — bastante **negative space** para a foto do produto respirar.

> Os HTML/JSX aqui são **referência de design** (protótipo), não código de produção. Recriar no ambiente alvo seguindo os padrões do codebase.
