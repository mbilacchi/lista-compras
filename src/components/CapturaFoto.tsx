import { useState, useRef } from 'react'
import { uploadFoto } from '../lib/uploadFoto'

interface CapturaFotoProps {
  itemId: string
  onFotoCapturada: (url: string) => void
  onErro: (erro: string) => void
}

export default function CapturaFoto({ itemId, onFotoCapturada, onErro }: CapturaFotoProps) {
  const [carregando, setCarregando] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelecionarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCarregando(true)
    try {
      // Mostra preview local
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)

      // Faz upload
      const url = await uploadFoto(file, itemId)
      onFotoCapturada(url)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      onErro(err?.message || 'Erro ao fazer upload')
      setPreview(null)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Preview da foto */}
      {preview && (
        <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
          <img src={preview} alt="preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="text-white font-semibold">Enviando...</span>
          </div>
        </div>
      )}

      {/* Botão de captura */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSelecionarFoto}
        disabled={carregando}
        className="hidden"
        id={`foto-input-${itemId}`}
      />

      <label
        htmlFor={`foto-input-${itemId}`}
        className={`block w-full py-3 px-4 text-center rounded-lg font-semibold transition cursor-pointer ${
          carregando
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {carregando ? '⏳ Enviando...' : '📸 Capturar Foto'}
      </label>
    </div>
  )
}
