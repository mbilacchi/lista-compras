import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lista, ListaItem, ItemFoto } from '../types'
import CapturaFoto from '../components/CapturaFoto'
import CampoMarcaAlternativa from '../components/CampoMarcaAlternativa'
import RelatorioFinal from '../components/RelatorioFinal'

export default function CompradorLista() {
  const { listaId } = useParams<{ listaId: string }>()
  const navigate = useNavigate()
  const [nomeComprador, setNomeComprador] = useState('')
  const [lista, setLista] = useState<Lista | null>(null)
  const [itens, setItens] = useState<ListaItem[]>([])
  const [fotos, setFotos] = useState<Record<string, ItemFoto[]>>({})
  const [carregando, setCarregando] = useState(true)
  const [iniciado, setIniciado] = useState(false)
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())
  const [erroFoto, setErroFoto] = useState<string>('')
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false)

  useEffect(() => {
    if (iniciado && listaId) {
      carregarDados()
      const subscription = supabase
        .channel(`lista:${listaId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'lista_itens', filter: `lista_id=eq.${listaId}` },
          () => carregarItens()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'item_fotos' },
          () => carregarFotos()
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [listaId, iniciado])

  const carregarDados = async () => {
    try {
      // Atualiza nome do comprador
      if (listaId && nomeComprador.trim()) {
        await supabase
          .from('listas')
          .update({ comprador_nome: nomeComprador })
          .eq('id', listaId)
      }

      const { data: listaData } = await supabase
        .from('listas')
        .select()
        .eq('id', listaId)
        .single()

      setLista(listaData)
      await carregarItens()
      await carregarFotos()
    } catch (err) {
      console.error('Erro ao carregar lista:', err)
    } finally {
      setCarregando(false)
    }
  }

  const carregarItens = async () => {
    try {
      const { data } = await supabase
        .from('lista_itens')
        .select()
        .eq('lista_id', listaId)
        .order('criado_em', { ascending: true })

      setItens(data || [])
    } catch (err) {
      console.error('Erro ao carregar itens:', err)
    }
  }

  const carregarFotos = async () => {
    try {
      const { data } = await supabase.from('item_fotos').select()

      const fotosPorItem: Record<string, ItemFoto[]> = {}
      data?.forEach((foto) => {
        if (!fotosPorItem[foto.item_id]) fotosPorItem[foto.item_id] = []
        fotosPorItem[foto.item_id].push(foto)
      })
      setFotos(fotosPorItem)
    } catch (err) {
      console.error('Erro ao carregar fotos:', err)
    }
  }

  const handleMarcarItem = async (itemId: string, novoStatus: string) => {
    try {
      await supabase
        .from('lista_itens')
        .update({ status: novoStatus })
        .eq('id', itemId)

      await carregarItens()
    } catch (err) {
      console.error('Erro ao atualizar item:', err)
    }
  }

  const handleFinalizarLista = () => {
    setMostrarRelatorio(true)
  }

  const handleConfirmarFinalizacao = async () => {
    try {
      await supabase.from('listas').update({ encerrada_em: new Date().toISOString() }).eq('id', listaId)

      alert('Lista finalizada! Obrigado.')
      navigate('/')
    } catch (err) {
      console.error('Erro ao finalizar:', err)
      alert('Erro ao finalizar lista.')
    }
  }

  const handleSalvarMarcaAlternativa = async (itemId: string, marca: string) => {
    try {
      await supabase
        .from('lista_itens')
        .update({ marca_alternativa: marca })
        .eq('id', itemId)

      await carregarItens()
    } catch (err) {
      console.error('Erro ao salvar marca alternativa:', err)
      throw err
    }
  }

  if (!iniciado) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Quem é você?</h1>
          <p className="text-gray-500 mb-6">Informe seu nome para prosseguir</p>

          <input
            type="text"
            value={nomeComprador}
            onChange={(e) => setNomeComprador(e.target.value)}
            placeholder="Ex: João"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            onKeyPress={(e) => e.key === 'Enter' && nomeComprador.trim() && setIniciado(true)}
          />

          <button
            onClick={() => setIniciado(true)}
            disabled={!nomeComprador.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            Começar
          </button>
        </div>
      </main>
    )
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

  const percentual =
    itens.length > 0 ? Math.round((itens.filter((i) => i.status !== 'pendente').length / itens.length) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lista de {lista.criador_nome}</h1>
              <p className="text-gray-500">Comprador: {nomeComprador}</p>
            </div>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 text-2xl">
              ←
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progresso:</span>
              <span className="font-semibold text-green-600">{percentual}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>

          {/* Botão finalizar */}
          <button
            onClick={handleFinalizarLista}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            ✓ Finalizar Separação
          </button>
        </div>

        {/* Erro de foto */}
        {erroFoto && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{erroFoto}</p>
            <button
              onClick={() => setErroFoto('')}
              className="text-red-500 text-sm mt-2 underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Lista de itens */}
        <div className="space-y-3">
          {itens.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
              {/* Info do item */}
              <div
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => {
                  const novo = new Set(expandidos)
                  if (novo.has(item.id)) novo.delete(item.id)
                  else novo.add(item.id)
                  setExpandidos(novo)
                }}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {item.descricao} {item.quantidade > 1 && `(${item.quantidade})`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.marca && `${item.marca} • `}
                    {item.quantidade} {item.unidade}
                  </div>
                </div>

                {/* Badge de status */}
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === 'pego'
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'em_falta'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.status === 'pego' ? '✓ Pego' : item.status === 'em_falta' ? '✗ Falta' : '○ Pendente'}
                </span>
              </div>

              {/* Expandir/Colapsar */}
              {expandidos.has(item.id) && (
                <div className="border-t pt-4 space-y-3">
                  {/* Fotos */}
                  {fotos[item.id] && fotos[item.id].length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Fotos capturadas:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {fotos[item.id].map((foto) => (
                          <img
                            key={foto.id}
                            src={foto.url}
                            alt="foto"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Captura de foto */}
                  {item.status !== 'em_falta' && (
                    <CapturaFoto
                      itemId={item.id}
                      onFotoCapturada={() => {
                        carregarFotos()
                      }}
                      onErro={(erro) => setErroFoto(erro)}
                    />
                  )}

                  {/* Marca alternativa (quando em falta) */}
                  {item.status === 'em_falta' && (
                    <CampoMarcaAlternativa
                      marcaSolicitada={item.marca}
                      marcaAlternativaAtual={item.marca_alternativa}
                      onSalvar={(marca) =>
                        handleSalvarMarcaAlternativa(item.id, marca)
                      }
                    />
                  )}

                  {/* Botões de status */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarcarItem(item.id, 'pego')}
                      className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      ✓ Peguei
                    </button>
                    <button
                      onClick={() => handleMarcarItem(item.id, 'em_falta')}
                      className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      ✗ Falta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {itens.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-400 text-lg">Nenhum item na lista</p>
            </div>
          )}
        </div>

        {/* Relatório Final */}
        {mostrarRelatorio && (
          <RelatorioFinal
            itens={itens}
            fotos={fotos}
            onConfirmar={handleConfirmarFinalizacao}
            onVoltar={() => setMostrarRelatorio(false)}
          />
        )}
      </div>
    </main>
  )
}
