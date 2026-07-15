import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface UsuarioAdmin {
  id: string
  email: string
  role: string
}

interface ListaAdmin {
  id: string
  criador_nome: string
  comprador_nome: string | null
  criada_em: string
  encerrada_em: string | null
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [listas, setListas] = useState<ListaAdmin[]>([])
  const [tab, setTab] = useState<'usuarios' | 'listas'>('usuarios')
  const [carregando, setCarregando] = useState(true)
  const [deletando, setDeletando] = useState<string | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setCarregando(true)
    try {
      // Carregar usuários
      const { data: usuariosData } = await supabase.auth.admin.listUsers()
      const usuariosFormatados = (usuariosData?.users || []).map((u) => ({
        id: u.id,
        email: u.email || '',
        role: (u.user_metadata?.role || 'comprador') as string,
      }))
      setUsuarios(usuariosFormatados)

      // Carregar listas
      const { data: listasData } = await supabase
        .from('listas')
        .select('*')
        .order('criada_em', { ascending: false })

      setListas(listasData || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setCarregando(false)
    }
  }

  const handleDeletarUsuario = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    setDeletando(id)
    try {
      await supabase.auth.admin.deleteUser(id)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
      alert('Erro ao deletar usuário')
    } finally {
      setDeletando(null)
    }
  }

  const handleDeletarLista = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta lista?')) return

    setDeletando(id)
    try {
      await supabase.from('listas').delete().eq('id', id)
      setListas((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error('Erro ao deletar lista:', err)
      alert('Erro ao deletar lista')
    } finally {
      setDeletando(null)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setTab('usuarios')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tab === 'usuarios'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Usuários ({usuarios.length})
            </button>
            <button
              onClick={() => setTab('listas')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                tab === 'listas'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Listas ({listas.length})
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {carregando ? (
              <p className="text-gray-500">Carregando...</p>
            ) : tab === 'usuarios' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{usuario.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              usuario.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : usuario.role === 'criador'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {usuario.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeletarUsuario(usuario.id)}
                            disabled={deletando === usuario.id}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
                          >
                            {deletando === usuario.id ? 'Deletando...' : 'Deletar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Criador</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Comprador</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listas.map((lista) => (
                      <tr key={lista.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{lista.criador_nome}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {lista.comprador_nome || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              lista.encerrada_em
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {lista.encerrada_em ? 'Finalizada' : 'Em andamento'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeletarLista(lista.id)}
                            disabled={deletando === lista.id}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
                          >
                            {deletando === lista.id ? 'Deletando...' : 'Deletar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
