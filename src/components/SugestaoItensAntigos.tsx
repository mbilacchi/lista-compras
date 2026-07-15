import { ListaItem } from '../types'

interface SugestaoItensAntigos {
  itens: ListaItem[]
  onRestaurar: () => void
  onIgnorar: () => void
  carregando?: boolean
}

export default function SugestaoItensAntigos({
  itens,
  onRestaurar,
  onIgnorar,
  carregando,
}: SugestaoItensAntigos) {
  if (itens.length === 0) return null

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <h2 className="text-lg font-semibold text-blue-900">Sua última lista tinha:</h2>
      </div>

      {/* Lista de itens sugeridos */}
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {itens.map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-sm bg-white p-2 rounded">
            <span className="text-blue-600 font-bold">✓</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.descricao}</p>
              <p className="text-xs text-gray-500">
                {item.marca && `${item.marca} • `}
                {item.quantidade} {item.unidade}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          onClick={onRestaurar}
          disabled={carregando}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
        >
          {carregando ? '⏳ Restaurando...' : '✓ Restaurar Tudo'}
        </button>
        <button
          onClick={onIgnorar}
          disabled={carregando}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
        >
          ✕ Ignorar
        </button>
      </div>
    </div>
  )
}
