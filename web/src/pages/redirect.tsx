import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { SpinnerIcon } from '../components/icons'
import { getLinkByShortUrl, incrementAccess } from '../lib/api'

export function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const [notFound, setNotFound] = useState(false)
  const [target, setTarget] = useState<string | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current || !shortUrl) return
    ran.current = true

    async function resolve() {
      try {
        const link = await getLinkByShortUrl(shortUrl!)
        // incrementa o acesso antes de redirecionar
        await incrementAccess(shortUrl!).catch(() => {})
        setTarget(link.originalUrl)
      } catch {
        setNotFound(true)
      }
    }

    resolve()
  }, [shortUrl])

  useEffect(() => {
    if (target) {
      window.location.href = target
    }
  }, [target])

  if (notFound) {
    return <Navigate to="/url/nao-encontrada" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-3">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg bg-white px-6 py-16 text-center shadow-sm">
        <span className="text-2xl font-bold text-blue-base">desafio prático 1</span>
        <SpinnerIcon className="h-8 w-8 text-blue-base" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-600">Redirecionando...</h1>
          <p className="text-sm text-gray-500">
            O link será aberto automaticamente em alguns instantes.
          </p>
          {target && (
            <p className="mt-2 text-sm text-gray-400">
              Não foi redirecionado?{' '}
              <a href={target} className="text-blue-base underline">
                Acesse aqui
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
