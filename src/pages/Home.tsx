import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleCriarLista = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    setCarregando(true)
    try {
      const { data, error } = await supabase
        .from('listas')
        .insert([{ criador_nome: nome }])
        .select()
        .single()

      if (error) throw error

      navigate(`/criador/${data.id}`)
    } catch (err: any) {
      const msgErro = err?.message || JSON.stringify(err)
      console.error('Erro ao criar lista:', msgErro)
      console.error('Stack:', err?.stack)
      alert(`Erro: ${msgErro}`)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-6xl text-center mb-6">🛒</div>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Lista de Compras
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Organize suas compras com facilidade
        </p>

        <form onSubmit={handleCriarLista} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Qual é seu nome?
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João"
              disabled={carregando}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!nome.trim() || carregando}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {carregando ? 'Criando...' : 'Criar Nova Lista'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          Sem login necessário — compartilhe o link por WhatsApp
        </p>
      </div>
    </main>
  )
}
