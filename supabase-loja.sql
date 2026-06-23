-- ============================================================
--  Axé de Quitéria — Loja: Tabelas da loja
--  Rode no SQL Editor do Supabase (projeto pebaphgqdguexsalgvrp)
-- ============================================================

-- ── PRODUTOS (catálogo da vitrine) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.produtos (
  id            TEXT PRIMARY KEY,
  estoque_id    TEXT REFERENCES public.estoque(id) ON DELETE SET NULL,
  nome          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  categoria     TEXT NOT NULL,
  preco         NUMERIC(10,2) NOT NULL,
  preco_antigo  NUMERIC(10,2),
  destaque      BOOLEAN NOT NULL DEFAULT false,
  badge         TEXT,
  orixa         TEXT,
  descricao     TEXT,
  fundamento    TEXT,
  materiais     JSONB NOT NULL DEFAULT '[]',
  variantes     JSONB NOT NULL DEFAULT '[]',
  avaliacao     NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  num_avaliacoes INTEGER NOT NULL DEFAULT 0,
  photo         TEXT,
  cores         JSONB NOT NULL DEFAULT '[]',
  tom           TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Leitura pública — catálogo visível para todos
CREATE POLICY "leitura_publica_produtos"
  ON public.produtos FOR SELECT
  USING (ativo = true);

-- Escrita apenas pelo app de gestão (header x-aq-secret)
CREATE POLICY "escrita_autenticada_produtos"
  ON public.produtos FOR INSERT
  WITH CHECK (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

CREATE POLICY "atualizacao_autenticada_produtos"
  ON public.produtos FOR UPDATE
  USING (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  )
  WITH CHECK (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

CREATE POLICY "exclusao_autenticada_produtos"
  ON public.produtos FOR DELETE
  USING (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

-- ── PEDIDOS (pedidos recebidos pela loja) ─────────────────────
CREATE TABLE IF NOT EXISTS public.pedidos (
  id         TEXT PRIMARY KEY,
  numero     TEXT NOT NULL,
  cliente    JSONB NOT NULL,
  itens      JSONB NOT NULL,
  frete      JSONB NOT NULL,
  pagamento  TEXT NOT NULL,
  total      NUMERIC(10,2) NOT NULL,
  status     TEXT NOT NULL DEFAULT 'producao',
  origem     TEXT NOT NULL DEFAULT 'loja',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Clientes podem inserir pedidos (checkout anônimo)
CREATE POLICY "insercao_publica_pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK (true);

-- Gestão lê e atualiza os pedidos
CREATE POLICY "leitura_autenticada_pedidos"
  ON public.pedidos FOR SELECT
  USING (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

CREATE POLICY "atualizacao_autenticada_pedidos"
  ON public.pedidos FOR UPDATE
  USING (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  )
  WITH CHECK (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

CREATE POLICY "exclusao_autenticada_pedidos"
  ON public.pedidos FOR DELETE
  USING (
    current_setting('request.headers', true)::json->>'x-aq-secret'
    = '834cf960-4082-4842-b69e-7ca477154e09'
  );

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS pedidos_status_idx ON public.pedidos (status);
CREATE INDEX IF NOT EXISTS pedidos_created_idx ON public.pedidos (created_at DESC);
CREATE INDEX IF NOT EXISTS produtos_cat_idx ON public.produtos (categoria);
CREATE INDEX IF NOT EXISTS produtos_destaque_idx ON public.produtos (destaque);
