import { useState } from 'react'
import { createShareToken, getShareUrl } from '../lib/auth'

interface ShareModalProps {
  listaId: string
  onClose: () => void
}

export default function ShareModal({ listaId, onClose }: ShareModalProps) {
  const [exigirLogin, setExigirLogin] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [linkCompartilhado, setLinkCompartilhado] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [erro, setErro] = useState('')

  const handleGerarLink = async () => {
    setGerando(true)
    setErro('')

    try {
      const token = await createShareToken(listaId, exigirLogin)
      const url = getShareUrl(listaId, token)
      setLinkCompartilhado(url)
    } catch (err: any) {
      setErro(err.message || 'Erro ao gerar link')
    } finally {
      setGerando(false)
    }
  }

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(linkCompartilhado)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      setErro('Erro ao copiar link')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Compartilhar Lista</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{erro}</p>
          </div>
        )}

        {linkCompartilhado ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Link de compartilhamento:</p>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 break-all text-sm text-gray-700 font-mono">
                {linkCompartilhado}
              </div>
            </div>

            {exigirLogin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-700 text-sm">
                  ℹ️ Comprador precisa fazer login para acessar
                </p>
              </div>
            )}

            {!exigirLogin && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">
                  ✓ Comprador pode acessar sem cadastro
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCopiar}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {copiado ? '✓ Copiado!' : '📋 Copiar Link'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Escolha como o comprador vai acessar a lista:
              </p>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    checked={!exigirLogin}
                    onChange={() => setExigirLogin(false)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Sem cadastro</p>
                    <p className="text-xs text-gray-500">
                      Qualquer pessoa com o link acessa
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    checked={exigirLogin}
                    onChange={() => setExigirLogin(true)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Exigir login</p>
                    <p className="text-xs text-gray-500">
                      Comprador precisa criar conta
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGerarLink}
                disabled={gerando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
              >
                {gerando ? 'Gerando...' : 'Gerar Link'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
