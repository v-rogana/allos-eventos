-- ============================================================
-- Allos Eventos — Tabelas de Temas e Palestrantes
-- Execute este SQL no Supabase SQL Editor
-- (apenas se as tabelas temas/palestrantes ainda não existem)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.temas (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            text NOT NULL,
  descricao       text DEFAULT '',
  tags            text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.temas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.temas
  FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.palestrantes (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            text NOT NULL,
  bio             text DEFAULT '',
  macro_temas     text[] DEFAULT '{}',
  disponivel      boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.palestrantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.palestrantes
  FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.tema_palestrante (
  tema_id         uuid NOT NULL REFERENCES public.temas(id) ON DELETE CASCADE,
  palestrante_id  uuid NOT NULL REFERENCES public.palestrantes(id) ON DELETE CASCADE,
  PRIMARY KEY (tema_id, palestrante_id)
);

ALTER TABLE public.tema_palestrante ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.tema_palestrante
  FOR ALL USING (true) WITH CHECK (true);
