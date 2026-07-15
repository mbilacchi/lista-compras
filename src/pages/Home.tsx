import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface MinhaLista {
  id: string
  criador_nome: string
  criada_em: string
  encerrada_em: string | null
}

export default function Home() {
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const [minhasListas, setMinhasListas] = useState<MinhaLista[]>([])
  const [carregandoListas, setCarregandoListas] = useState(false)
  const [criando, setCriando] = useState(false)

  // Carregar listas do usuário logado
  useEffect(() => {
    if (user && user.role === 'criador') {
      carregarMinhasListas()
    }
  }, [user])

  const carregarMinhasListas = async () => {
    if (!user) return

    setCarregandoListas(true)
    try {
      const { data } = await supabase
        .from('listas')
        .select('*')
        .eq('criador_id', user.id)
        .order('criada_em', { ascending: false })

      setMinhasListas(data || [])
    } catch (err) {
      console.error('Erro ao carregar listas:', err)
    } finally {
      setCarregandoListas(false)
    }
  }

  const handleCriarNovaLista = async () => {
    setCriando(true)
    try {
      const { data, error } = await supabase
        .from('listas')
        .insert([
          {
            criador_nome: user?.email || '',
            criador_id: user?.id,
          },
        ])
        .select()
        .single()

      if (error) throw error
      navigate(`/criador/${data.id}`)
    } catch (err: any) {
      console.error('Erro ao criar lista:', err)
      alert(err.message || 'Erro ao criar lista')
    } finally {
      setCriando(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </main>
    )
  }

  // Se não está autenticado
  if (!user) {
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

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
            >
              Fazer Login
            </Link>
            <Link
              to="/registro"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
            >
              Criar Conta
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            Crie uma conta para começar a gerenciar suas listas
          </p>
        </div>
      </main>
    )
  }

  // Se é admin
  if (user.role === 'admin') {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, Admin!</h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </div>

            <Link
              to="/admin"
              className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Acessar Admin Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Se é criador
  if (user.role === 'criador') {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Minhas Listas</h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </div>

            <button
              onClick={handleCriarNovaLista}
              disabled={criando}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {criando ? '+ Criando...' : '+ Nova Lista'}
            </button>
          </div>

          {/* Minhas Listas */}
          {carregandoListas ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-400">Carregando listas...</p>
            </div>
          ) : minhasListas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">Nenhuma lista criada ainda</p>
              <p className="text-gray-400">Clique em "Nova Lista" para começar</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {minhasListas.map((lista) => (
                <div
                  key={lista.id}
                  onClick={() => navigate(`/criador/${lista.id}`)}
                  className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{lista.criador_nome}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(lista.criada_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lista.encerrada_em
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {lista.encerrada_em ? 'Finalizada' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    )
  }

  // Se é comprador
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Bem-vindo!</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          <p className="text-gray-600 mt-6">
            Acesse as listas compartilhadas com você através do link do criador.
          </p>
        </div>
      </div>
    </main>
  )
}
