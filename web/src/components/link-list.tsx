import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLinks } from '../hooks/use-links'
import { exportLinksCsv } from '../lib/api'
import { DownloadIcon, LinkIcon, SpinnerIcon } from './icons'
import { LinkItem } from './link-item'

export function LinkList() {
  const { data: links, isLoading } = useLinks()
  const [exporting, setExporting] = useState(false)

  const hasLinks = links && links.length > 0

  async function handleDownloadCsv() {
    try {
      setExporting(true)
      const { url } = await exportLinksCsv()
      // dispara o download do arquivo servido pela CDN
      window.open(url, '_blank')
      toast.success('CSV gerado com sucesso!')
    } catch {
      toast.error('Erro ao gerar o CSV.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>
        <button
          type="button"
          onClick={handleDownloadCsv}
          disabled={!hasLinks || exporting}
          className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:ring-2 hover:ring-blue-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? <SpinnerIcon className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
          Baixar CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-2 border-t border-gray-200 py-10 text-gray-400">
          <SpinnerIcon className="h-6 w-6" />
          <span className="text-xs uppercase">Carregando links</span>
        </div>
      ) : hasLinks ? (
        <div className="flex flex-col">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 border-t border-gray-200 py-10 text-gray-400">
          <LinkIcon className="h-6 w-6" />
          <span className="text-xs uppercase">Ainda não existem links cadastrados</span>
        </div>
      )}
    </div>
  )
}
