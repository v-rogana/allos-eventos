-- ============================================================
-- Allos Eventos — Criação das tabelas
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- 1. Tabela de eventos (briefings)
CREATE TABLE public.eventos (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria       text NOT NULL,
  tipo            text NOT NULL,
  status          text NOT NULL DEFAULT 'rascunho',
  objetivo        text,
  tema_id         text,
  tema_custom     text,
  publico_alvo    text,
  conteudo        text,
  formato_modalidade    text,
  formato_periodo       text,
  formato_duracao_horas numeric,
  parceiros       text,
  recursos        text[] DEFAULT '{}',
  metas_inscritos     integer,
  metas_presenca      integer,
  metas_conversoes    integer,
  metas_qualitativas  text,
  data_evento     date,
  cronograma      jsonb DEFAULT '[]',
  orcamento       jsonb DEFAULT '{}',
  plano_divulgacao jsonb DEFAULT '[]',
  checklist_pre   jsonb DEFAULT '[]',
  checklist_dia   jsonb DEFAULT '[]',
  checklist_pos   jsonb DEFAULT '[]',
  criado_por      text NOT NULL,
  pessoas         text[] DEFAULT '{}',
  tags            text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.eventos
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Tabela de instituições (prospecção)
CREATE TABLE public.instituicoes (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            text NOT NULL,
  tipo            text NOT NULL,
  cidade          text DEFAULT '',
  estado          text DEFAULT '',
  contato_nome    text DEFAULT '',
  contato_cargo   text DEFAULT '',
  contato_telefone text DEFAULT '',
  contato_email   text DEFAULT '',
  status          text NOT NULL DEFAULT 'nao_contatada',
  promoter_responsavel text DEFAULT '',
  data_criacao          timestamptz DEFAULT now(),
  data_primeiro_contato timestamptz,
  data_ultimo_contato   timestamptz,
  notas           text DEFAULT ''
);

ALTER TABLE public.instituicoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.instituicoes
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Tabela de interações (histórico de contatos)
CREATE TABLE public.interacoes (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao_id  uuid NOT NULL REFERENCES public.instituicoes(id) ON DELETE CASCADE,
  data            timestamptz NOT NULL DEFAULT now(),
  tipo            text NOT NULL,
  descricao       text NOT NULL,
  responsavel     text DEFAULT ''
);

ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.interacoes
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Tabela de temas
CREATE TABLE public.temas (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            text NOT NULL,
  descricao       text DEFAULT '',
  tags            text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.temas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.temas
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Tabela de palestrantes
CREATE TABLE public.palestrantes (
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

-- 6. Relação tema-palestrante
CREATE TABLE public.tema_palestrante (
  tema_id         uuid NOT NULL REFERENCES public.temas(id) ON DELETE CASCADE,
  palestrante_id  uuid NOT NULL REFERENCES public.palestrantes(id) ON DELETE CASCADE,
  PRIMARY KEY (tema_id, palestrante_id)
);

ALTER TABLE public.tema_palestrante ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON public.tema_palestrante
  FOR ALL USING (true) WITH CHECK (true);
