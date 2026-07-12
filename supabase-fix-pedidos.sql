-- ============================================================
--  Fix: pedidos não salvando da loja
--  Rode no SQL Editor do Supabase (projeto pebaphgqdguexsalgvrp)
-- ============================================================

-- 1. Garante que a tabela existe
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

-- 2. Habilita RLS
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- 3. Policies (idempotente)
DROP POLICY IF EXISTS "insercao_publica_pedidos"       ON public.pedidos;
DROP POLICY IF EXISTS "leitura_autenticada_pedidos"    ON public.pedidos;
DROP POLICY IF EXISTS "atualizacao_autenticada_pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "exclusao_autenticada_pedidos"   ON public.pedidos;

-- Clientes da loja podem inserir (anônimo)
CREATE POLICY "insercao_publica_pedidos"
  ON public.pedidos FOR INSERT
  TO anon
  WITH CHECK (true);

-- Gestão lê e atualiza via x-aq-secret
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

-- 4. CRÍTICO: grants de permissão no nível PostgreSQL
--    Sem isso, RLS nunca avalia — o role não tem acesso à tabela
GRANT INSERT              ON public.pedidos TO anon;
GRANT SELECT, UPDATE      ON public.pedidos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pedidos TO service_role;

-- 5. Índices
CREATE INDEX IF NOT EXISTS pedidos_status_idx  ON public.pedidos (status);
CREATE INDEX IF NOT EXISTS pedidos_created_idx ON public.pedidos (created_at DESC);
