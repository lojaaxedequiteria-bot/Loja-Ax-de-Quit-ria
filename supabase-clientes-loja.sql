-- ============================================================
-- CLIENTES DA LOJA — Auth customizado sem confirmação de email
-- Execute no Supabase SQL Editor do projeto pebaphgqdguexsalgvrp
-- ============================================================

-- 1. Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes_loja (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  senha      TEXT NOT NULL,  -- SHA-256 hex hash
  tel        TEXT DEFAULT '',
  enderecos  JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE clientes_loja ENABLE ROW LEVEL SECURITY;
-- Sem políticas diretas: acesso exclusivamente via RPC SECURITY DEFINER

-- 2. Número automático para pedidos (se não houver trigger ainda)
CREATE OR REPLACE FUNCTION generate_pedido_numero()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := 'AQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-'
               || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_pedido_numero ON pedidos;
CREATE TRIGGER set_pedido_numero
  BEFORE INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION generate_pedido_numero();

-- 3. Campo rastreio nos pedidos (para rastrear Correios)
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS rastreio TEXT DEFAULT '';

-- ============================================================
-- RPCs — Todas SECURITY DEFINER (bypass RLS, correm como postgres)
-- ============================================================

-- 3.1 Registro
CREATE OR REPLACE FUNCTION loja_register(p_nome TEXT, p_email TEXT, p_senha TEXT)
RETURNS TABLE(id uuid, nome TEXT, email TEXT, enderecos JSONB)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO clientes_loja(nome, email, senha)
  VALUES (p_nome, p_email, p_senha)
  ON CONFLICT(email) DO NOTHING;

  RETURN QUERY
    SELECT cl.id, cl.nome, cl.email, cl.enderecos
    FROM clientes_loja cl
    WHERE cl.email = p_email AND cl.senha = p_senha;
END;
$$;

-- 3.2 Login
CREATE OR REPLACE FUNCTION loja_login(p_email TEXT, p_senha TEXT)
RETURNS TABLE(id uuid, nome TEXT, email TEXT, enderecos JSONB)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, nome, email, enderecos
  FROM clientes_loja
  WHERE email = p_email AND senha = p_senha
  LIMIT 1;
$$;

-- 3.3 Atualizar endereços (autenticado via id)
CREATE OR REPLACE FUNCTION loja_update_enderecos(p_id uuid, p_enderecos JSONB)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  UPDATE clientes_loja SET enderecos = p_enderecos WHERE id = p_id;
$$;

-- 3.4 Buscar todos os pedidos de um cliente por email
CREATE OR REPLACE FUNCTION loja_get_orders(p_email TEXT)
RETURNS TABLE(
  numero       TEXT,
  status       TEXT,
  data_criacao TIMESTAMPTZ,
  itens        JSONB,
  total        NUMERIC,
  rastreio     TEXT
)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    COALESCE(p.numero, p.id::TEXT) AS numero,
    p.status,
    p.created_at                    AS data_criacao,
    p.itens,
    p.total,
    COALESCE(p.rastreio, '')        AS rastreio
  FROM pedidos p
  WHERE p.cliente->>'email' = p_email
  ORDER BY p.created_at DESC;
$$;

-- 3.5 Rastrear pedido específico (email + número)
CREATE OR REPLACE FUNCTION loja_track_order(p_email TEXT, p_numero TEXT)
RETURNS TABLE(
  numero       TEXT,
  status       TEXT,
  data_criacao TIMESTAMPTZ,
  rastreio     TEXT
)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    COALESCE(p.numero, p.id::TEXT) AS numero,
    p.status,
    p.created_at                    AS data_criacao,
    COALESCE(p.rastreio, '')        AS rastreio
  FROM pedidos p
  WHERE p.cliente->>'email' = p_email
    AND (p.numero = p_numero OR p.id::TEXT = p_numero)
  LIMIT 1;
$$;

-- ============================================================
-- APÓS EXECUTAR: verificar no Supabase Dashboard
-- Project Settings → Auth → Email → desabilitar "Confirm email"
-- (garante que signUp antigos também não peçam confirmação)
-- ============================================================
