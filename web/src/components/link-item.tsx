import toast from 'react-hot-toast'
import { env } from '../env'
import { useDeleteLink } from '../hooks/use-links'
import type { Link } from '../lib/api'
import { CopyIcon, TrashIcon } from './icons'

const shortHost = env.FRONTEND_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const deleteLink = useDeleteLink()

  const shortDisplay = `${shortHost}/${link.shortUrl}`
  const fullShortUrl = `${env.FRONTEND_URL.replace(/\/$/, '')}/${link.shortUrl}`

  async function handleCopy() {
    await navigator.clipboard.writeText(fullShortUrl)
    toast.success('Link copiado para a área de transferência!')
  }

  function handleDelete() {
    const ok = window.confirm(`Deseja realmente apagar o link ${shortDisplay}?`)
    if (ok) {
      deleteLink.mutate(link.shortUrl)
    }
  }

  return (
    <div className="flex items-center gap-4 border-t border-gray-200 py-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <a
          href={fullShortUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate text-sm font-semibold text-blue-base hover:underline"
        >
          {shortDisplay}
        </a>
        <span className="truncate text-sm text-gray-400">{link.originalUrl}</span>
      </div>

      <span className="whitespace-nowrap text-sm text-gray-500">
        {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleCopy}
          title="Copiar link"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-600 transition hover:ring-2 hover:ring-blue-base"
        >
          <CopyIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteLink.isPending}
          title="Apagar link"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-600 transition hover:ring-2 hover:ring-danger disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
