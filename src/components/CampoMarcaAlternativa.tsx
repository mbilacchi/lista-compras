import { useState, useEffect } from 'react'

interface CampoMarcaAlternativaProps {
  marcaSolicitada: string | null
  marcaAlternativaAtual: string | null
  onSalvar: (marca: string) => Promise<void>
  carregando?: boolean
}

export default function CampoMarcaAlternativa({
  marcaSolicitada,
  marcaAlternativaAtual,
  onSalvar,
  carregando,
}: CampoMarcaAlternativaProps) {
  const [marca, setMarca] = useState(marcaAlternativaAtual || '')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    setMarca(marcaAlternativaAtual || '')
  }, [marcaAlternativaAtual])

  const handleSalvar = async () => {
    if (!marca.trim()) return

    setSalvando(true)
    try {
      await onSalvar(marca)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Marca solicitada:</p>
        <p className="text-sm text-gray-600">{marcaSolicitada || 'Não especificada'}</p>
      </div>

      <div>
        <label htmlFor="marca-alt" className="text-sm font-medium text-gray-700 block mb-2">
          Marca disponível na loja:
        </label>
        <div className="flex gap-2">
          <input
            id="marca-alt"
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Ex: Marca X"
            disabled={salvando || carregando}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            onKeyPress={(e) => e.key === 'Enter' && handleSalvar()}
          />
          <button
            onClick={handleSalvar}
            disabled={!marca.trim() || salvando || carregando}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {salvando ? '⏳' : '✓'}
          </button>
        </div>
      </div>

      {marcaAlternativaAtual && (
        <p className="text-xs text-green-600 font-medium">
          ✓ Marca registrada: {marcaAlternativaAtual}
        </p>
      )}
    </div>
  )
}
