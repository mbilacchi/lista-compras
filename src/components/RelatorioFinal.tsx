import { ListaItem, ItemFoto } from '../types'

interface RelatorioFinalProps {
  itens: ListaItem[]
  fotos: Record<string, ItemFoto[]>
  onConfirmar: () => void
  onVoltar: () => void
}

export default function RelatorioFinal({
  itens,
  fotos,
  onConfirmar,
  onVoltar,
}: RelatorioFinalProps) {
  const itensPegos = itens.filter((i) => i.status === 'pego')
  const itensEmFalta = itens.filter((i) => i.status === 'em_falta')
  const itensPendentes = itens.filter((i) => i.status === 'pendente')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Relatório da Separação</h1>
          <p className="text-gray-500">Resumo final da lista de compras</p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <p className="text-3xl font-bold text-green-600">{itensPegos.length}</p>
              <p className="text-sm text-gray-600 mt-1">Itens Pegos</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <p className="text-3xl font-bold text-red-600">{itensEmFalta.length}</p>
              <p className="text-sm text-gray-600 mt-1">Itens em Falta</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <p className="text-3xl font-bold text-yellow-600">{itensPendentes.length}</p>
              <p className="text-sm text-gray-600 mt-1">Itens Pendentes</p>
            </div>
          </div>

          {/* Itens Pegos */}
          {itensPegos.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-green-700 mb-3">✓ Itens Pegos</h2>
              <div className="space-y-2">
                {itensPegos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.descricao}</p>
                      <p className="text-xs text-gray-500">
                        {item.marca && `${item.marca} • `}
                        {item.quantidade} {item.unidade}
                      </p>
                    </div>
                    {fotos[item.id] && fotos[item.id].length > 0 && (
                      <div className="flex gap-1 ml-2">
                        {fotos[item.id].map((foto) => (
                          <img
                            key={foto.id}
                            src={foto.url}
                            alt="foto"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itens em Falta */}
          {itensEmFalta.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-3">✗ Itens em Falta</h2>
              <div className="space-y-3">
                {itensEmFalta.map((item) => (
                  <div key={item.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.descricao}</p>
                        <p className="text-xs text-gray-500">
                          {item.marca && `Solicitado: ${item.marca}`}
                        </p>
                      </div>
                    </div>

                    {/* Marca Alternativa */}
                    {item.marca_alternativa && (
                      <div className="mb-3 p-2 bg-white rounded border border-red-100">
                        <p className="text-xs font-medium text-gray-600 mb-1">Marca Alternativa:</p>
                        <p className="text-sm font-semibold text-gray-800">{item.marca_alternativa}</p>
                      </div>
                    )}

                    {/* Fotos */}
                    {fotos[item.id] && fotos[item.id].length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Fotos:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {fotos[item.id].map((foto) => (
                            <img
                              key={foto.id}
                              src={foto.url}
                              alt="foto"
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itens Pendentes */}
          {itensPendentes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-yellow-700 mb-3">○ Itens Não Processados</h2>
              <div className="space-y-2">
                {itensPendentes.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <p className="font-medium text-gray-800">{item.descricao}</p>
                    <p className="text-xs text-gray-500">
                      {item.marca && `${item.marca} • `}
                      {item.quantidade} {item.unidade}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
          <button
            onClick={onVoltar}
            className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
          >
            ← Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            ✓ Confirmar & Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}
