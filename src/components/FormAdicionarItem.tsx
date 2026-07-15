import { useState } from 'react'
import { UNIDADES } from '../types'

interface FormAdicionarItemProps {
  onAdicionar: (item: {
    descricao: string
    marca: string
    unidade: typeof UNIDADES[number]
    quantidade: number
  }) => void
}

export default function FormAdicionarItem({ onAdicionar }: FormAdicionarItemProps) {
  const [descricao, setDescricao] = useState('')
  const [marca, setMarca] = useState('')
  const [unidade, setUnidade] = useState<typeof UNIDADES[number]>('un')
  const [quantidade, setQuantidade] = useState(1)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim()) return

    setCarregando(true)
    try {
      await onAdicionar({
        descricao: descricao.trim(),
        marca: marca.trim(),
        unidade,
        quantidade,
      })

      setDescricao('')
      setMarca('')
      setUnidade('un')
      setQuantidade(1)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Arroz integral"
            disabled={carregando}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            required
          />
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
            Marca (opcional)
          </label>
          <input
            id="marca"
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Ex: Tio João"
            disabled={carregando}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          />
        </div>

        {/* Unidade e Quantidade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
              Unidade *
            </label>
            <select
              id="unidade"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value as typeof UNIDADES[number])}
              disabled={carregando}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade *
            </label>
            <input
              id="quantidade"
              type="number"
              min="0.1"
              step="0.1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseFloat(e.target.value))}
              disabled={carregando}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={!descricao.trim() || carregando}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
        >
          {carregando ? 'Adicionando...' : '+ Adicionar Item'}
        </button>
      </form>
    </div>
  )
}
