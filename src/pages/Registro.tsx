import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../lib/auth'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../contexts/AuthContext'

export default function Registro() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('comprador')
  const [termo, setTermo] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Se já está logado, redireciona
  if (user) {
    navigate('/')
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!termo) {
      setErro('Você precisa aceitar os termos de uso')
      return
    }

    setCarregando(true)

    try {
      await signup(email, password, role)
      // Após signup bem-sucedido, redireciona para home
      // O usuário pode fazer login ou será redirecionado
      navigate('/')
    } catch (err: any) {
      setErro(err.message || 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Conta</h1>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{erro}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuário
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="comprador">Comprador (acessa listas compartilhadas)</option>
              <option value="criador">Criador (cria e gerencia listas)</option>
            </select>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="termo"
              type="checkbox"
              checked={termo}
              onChange={(e) => setTermo(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="termo" className="text-sm text-gray-600">
              Concordo com os termos de uso e política de privacidade
            </label>
          </div>

          <button
            type="submit"
            disabled={carregando || !termo}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {carregando ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  )
}
