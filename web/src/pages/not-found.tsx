import { Link } from 'react-router-dom'
import { WarningIcon } from '../components/icons'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-3">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-lg bg-white px-6 py-16 text-center shadow-sm">
        <WarningIcon className="h-12 w-12 text-blue-base" />
        <h1 className="text-2xl font-bold text-gray-600">Link não encontrado</h1>
        <p className="max-w-sm text-sm text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
        </p>
        <Link
          to="/"
          className="text-sm text-blue-base underline transition hover:text-blue-dark"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  )
}
