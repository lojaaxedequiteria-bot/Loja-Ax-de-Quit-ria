/* ===== Axé de Quitéria — Loja: Catálogo e Configurações ===== */

function brl(n){ return 'R$ '+(n||0).toFixed(2).replace('.',','); }

var LJ_PRODUCTS = [];

var LJ_CATS = [
  {id:'todos',     label:'Todos'},
  {id:'guias',     label:'Guias'},
  {id:'pulseiras', label:'Pulseiras'},
  {id:'braceletes',label:'Braceletes'},
  {id:'protecao',  label:'Proteção'},
  {id:'velas',     label:'Velas'},
  {id:'banho',     label:'Banho e ervas'},
  {id:'vestuario', label:'Vestuário'},
  {id:'chapeus',   label:'Chapéus'},
  {id:'casa',      label:'Para casa'},
];

var LJ_CAT_CARDS = [
  {id:'Falangeiros',  name:'Falangeiros',   sub:'Guardiões e escolta espiritual',      tone:'#C4553B'},
  {id:'Caboclos',     name:'Caboclos',      sub:'Força da mata e das flechas',         tone:'#3E7D4F'},
  {id:'Pretos Velhos',name:'Pretos Velhos', sub:'Sabedoria e cura ancestral',          tone:'#5C3A6D'},
  {id:'Ciganos',      name:'Ciganos',       sub:'Sorte, amor e abertura de caminhos',  tone:'#C9821C'},
  {id:'Erês',         name:'Erês',          sub:'Alegria, leveza e cura',              tone:'#E87B9B'},
  {id:'Marinheiros',  name:'Marinheiros',   sub:'Proteção das águas e viagens',        tone:'#2E6B9E'},
  {id:'Boiadeiros',   name:'Boiadeiros',    sub:'Força do campo e da terra',           tone:'#8A5C30'},
  {id:'Baianos',      name:'Baianos',       sub:'Alegria, festa e caminhos livres',    tone:'#D65934'},
  {id:'Malandros',    name:'Malandros',     sub:'Esperteza e virada de jogo',          tone:'#C1272D'},
  {id:'Exus',         name:'Exus',          sub:'Mensageiros e guardiões das ruas',    tone:'#3D2B1F'},
  {id:'Pombagiras',   name:'Pombagiras',    sub:'Amor, força e sensualidade',          tone:'#B5003B'},
  {id:'Mirins',       name:'Mirins',        sub:'Leveza e cura das crianças de luz',   tone:'#5BA4D4'},
];

var LJ_STORE = {
  whatsapp: '5551996813336',
  nome: 'Axé de Quitéria',
  email: 'atendimento@lojaaxédequitéria.com.br',
};

var LJ_SHIPPING = [
  {id:'correios', label:'Correios — PAC', value:24.9, prazo:'5–8 dias úteis'},
  {id:'retirada', label:'Retirada em Porto Alegre', value:0, prazo:'Combinar horário'},
];

var LJ_ORDERS_KEY = 'axe-quiteria:loja:orders:v1';
