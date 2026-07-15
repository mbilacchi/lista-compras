// Tipos base do domínio da Lista de Compras.
// Servem de contrato entre o frontend e a tabela do Supabase.

/** Unidades de medida pré-definidas para agilizar o preenchimento. */
export type Unidade = 'un' | 'kg' | 'g' | 'L' | 'ml' | 'pct' | 'cx' | 'dz'

export const UNIDADES: Unidade[] = ['un', 'kg', 'g', 'L', 'ml', 'pct', 'cx', 'dz']

/** Status de cada item durante a separação no mercado. */
export type ItemStatus = 'pendente' | 'pego' | 'em_falta'

export interface ListaItem {
  id: string
  lista_id: string
  descricao: string
  marca: string | null
  unidade: Unidade
  quantidade: number
  status: ItemStatus
  /** Marca encontrada na loja, caso a marca solicitada esteja em falta. */
  marca_alternativa: string | null
  /** Usado para ordenar os itens na tela. */
  criado_em: string
}

export interface Lista {
  id: string
  /** Nome de quem criou a lista (sem cadastro/login). */
  criador_nome: string
  /** Nome de quem vai ao mercado, informado ao abrir o link. */
  comprador_nome: string | null
  criada_em: string
  /** Preenchido quando o comprador encerra a lista (mesmo com faltas). */
  encerrada_em: string | null
}

export interface ItemFoto {
  id: string
  item_id: string
  url: string
  criado_em: string
}
