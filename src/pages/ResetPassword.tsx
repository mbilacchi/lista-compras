import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { resetPasswordEmail } from '../lib/auth'
import { useAuth } from '../hooks/useAuth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Se já está logado, redireciona
  if (user) {
    navigate('/')
    return null
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await resetPasswordEmail(email)
      setEnviado(true)
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar email de reset')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Redefinir Senha
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Receberá um link de reset por email
        </p>

        {enviado ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold mb-4">Email enviado!</p>
            <p className="text-green-600 text-sm mb-6">
              Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voltar para login
            </Link>
          </div>
        ) : (
          <>
            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{erro}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
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

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {carregando ? 'Enviando...' : 'Enviar Email de Reset'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Lembrou sua senha?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Fazer login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
