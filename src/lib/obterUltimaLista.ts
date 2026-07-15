import { supabase } from './supabase'
import { Lista } from '../types'

/**
 * Obtém a última lista criada por um criador (excluindo a lista atual)
 */
export async function obterUltimaLista(criadorNome: string, listaAtualId: string) {
  try {
    const { data: listas } = await supabase
      .from('listas')
      .select()
      .eq('criador_nome', criadorNome)
      .neq('id', listaAtualId)
      .order('criada_em', { ascending: false })
      .limit(1)

    if (!listas || listas.length === 0) return null
    return listas[0] as Lista
  } catch (err) {
    console.error('Erro ao buscar última lista:', err)
    return null
  }
}

/**
 * Obtém todos os itens de uma lista
 */
export async function obterItensLista(listaId: string) {
  try {
    const { data } = await supabase
      .from('lista_itens')
      .select()
      .eq('lista_id', listaId)
      .order('criado_em', { ascending: true })

    return data || []
  } catch (err) {
    console.error('Erro ao buscar itens:', err)
    return []
  }
}

/**
 * Copia itens de uma lista anterior para a nova lista
 */
export async function copiarItensDoPassado(
  itensSemFoto: Array<{
    descricao: string
    marca: string | null
    unidade: string
    quantidade: number
  }>,
  listaNovaId: string
) {
  try {
    const itensParaInserir = itensSemFoto.map((item) => ({
      lista_id: listaNovaId,
      descricao: item.descricao,
      marca: item.marca,
      unidade: item.unidade,
      quantidade: item.quantidade,
      status: 'pendente',
    }))

    const { error } = await supabase.from('lista_itens').insert(itensParaInserir)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Erro ao copiar itens:', err)
    return false
  }
}
