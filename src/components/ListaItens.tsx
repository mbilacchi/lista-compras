import { ListaItem } from '../types'

interface ListaItensProps {
  itens: ListaItem[]
  onDeletar: (itemId: string) => void
}

export default function ListaItens({ itens, onDeletar }: ListaItensProps) {
  return (
    <div className="space-y-3">
      {itens.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
        >
          <div className="flex-1">
            <div className="font-medium text-gray-800">
              {item.descricao} {item.quantidade > 1 && `(${item.quantidade})`}
            </div>
            <div className="text-sm text-gray-500 flex gap-3 mt-1">
              {item.marca && <span>Marca: {item.marca}</span>}
              <span className="text-gray-400">•</span>
              <span>{item.quantidade} {item.unidade}</span>
            </div>
          </div>

          <button
            onClick={() => onDeletar(item.id)}
            className="ml-4 text-red-500 hover:text-red-700 font-semibold transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
