import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lista, ListaItem, UNIDADES } from '../types'
import FormAdicionarItem from '../components/FormAdicionarItem'
import ListaItens from '../components/ListaItens'
import SugestaoItensAntigos from '../components/SugestaoItensAntigos'
import { obterUltimaLista, obterItensLista, copiarItensDoPassado } from '../lib/obterUltimaLista'

export default function CriadorLista() {
  const { listaId } = useParams<{ listaId: string }>()
  const navigate = useNavigate()
  const [lista, setLista] = useState<Lista | null>(null)
  const [itens, setItens] = useState<ListaItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [itensSugeridos, setItensSugeridos] = useState<ListaItem[]>([])
  const [mostrarSugestao, setMostrarSugestao] = useState(false)
  const [restaurando, setRestaurando] = useState(false)

  useEffect(() => {
    carregarLista()
    const subscription = supabase
      .channel(`lista:${listaId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lista_itens', filter: `lista_id=eq.${listaId}` },
        () => carregarItens()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [listaId])

  const carregarLista = async () => {
    try {
      const { data, error } = await supabase
        .from('listas')
        .select()
        .eq('id', listaId)
        .single()

      if (error) throw error
      setLista(data)
      await carregarItens()

      // Carregar sugestões da lista anterior
      const ultimaLista = await obterUltimaLista(data.criador_nome, listaId!)
      if (ultimaLista) {
        const itensAntigos = await obterItensLista(ultimaLista.id)
        if (itensAntigos.length > 0) {
          setItensSugeridos(itensAntigos)
          setMostrarSugestao(true)
        }
      }
    } catch (err) {
      console.error('Erro ao carregar lista:', err)
      navigate('/')
    } finally {
      setCarregando(false)
    }
  }

  const carregarItens = async () => {
    try {
      const { data, error } = await supabase
        .from('lista_itens')
        .select()
        .eq('lista_id', listaId)
        .order('criado_em', { ascending: true })

      if (error) throw error
      setItens(data || [])
    } catch (err) {
      console.error('Erro ao carregar itens:', err)
    }
  }

  const handleAdicionarItem = async (novoItem: {
    descricao: string
    marca: string
    unidade: typeof UNIDADES[number]
    quantidade: number
  }) => {
    try {
      const { error } = await supabase.from('lista_itens').insert([
        {
          lista_id: listaId,
          descricao: novoItem.descricao,
          marca: novoItem.marca || null,
          unidade: novoItem.unidade,
          quantidade: novoItem.quantidade,
        },
      ])

      if (error) throw error
      await carregarItens()
    } catch (err) {
      console.error('Erro ao adicionar item:', err)
      alert('Erro ao adicionar item.')
    }
  }

  const handleDeletarItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from('lista_itens').delete().eq('id', itemId)
      if (error) throw error
      await carregarItens()
    } catch (err) {
      console.error('Erro ao deletar item:', err)
      alert('Erro ao deletar item.')
    }
  }

  const copiarLink = () => {
    const link = `${window.location.origin}/#/comprador/${listaId}`
    navigator.clipboard.writeText(link)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const handleRestaurarSugestoes = async () => {
    setRestaurando(true)
    try {
      const itensARestaurar = itensSugeridos.map((item) => ({
        descricao: item.descricao,
        marca: item.marca,
        unidade: item.unidade,
        quantidade: item.quantidade,
      }))

      const sucesso = await copiarItensDoPassado(itensARestaurar, listaId!)
      if (sucesso) {
        await carregarItens()
        setMostrarSugestao(false)
      }
    } catch (err) {
      console.error('Erro ao restaurar itens:', err)
    } finally {
      setRestaurando(false)
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </main>
    )
  }

  if (!lista) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Lista não encontrada</div>
      </main>
    )
  }

  const percentualConcluido =
    itens.length > 0 ? Math.round((itens.filter((i) => i.status !== 'pendente').length / itens.length) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Lista de {lista.criador_nome}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {itens.length} {itens.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ←
            </button>
          </div>

          {/* Link para compartilhar */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Compartilhar com o comprador:
            </p>
            <button
              onClick={copiarLink}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                linkCopiado
                  ? 'bg-green-600 text-white'
                  : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              {linkCopiado ? '✓ Link copiado!' : '📋 Copiar link do comprador'}
            </button>
          </div>
        </div>

        {/* Sugestão de itens antigos */}
        {mostrarSugestao && (
          <SugestaoItensAntigos
            itens={itensSugeridos}
            onRestaurar={handleRestaurarSugestoes}
            onIgnorar={() => setMostrarSugestao(false)}
            carregando={restaurando}
          />
        )}

        {/* Adicionar Item */}
        <FormAdicionarItem onAdicionar={handleAdicionarItem} />

        {/* Lista de itens */}
        {itens.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progresso de separação:</span>
                <span className="font-semibold text-green-600">{percentualConcluido}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentualConcluido}%` }}
                />
              </div>
            </div>

            <ListaItens itens={itens} onDeletar={handleDeletarItem} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-400 text-lg">Nenhum item adicionado ainda</p>
            <p className="text-gray-400 text-sm">Use o formulário acima para começar</p>
          </div>
        )}
      </div>
    </main>
  )
}
