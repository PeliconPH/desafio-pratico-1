import { LinkForm } from '../components/link-form'
import { LinkList } from '../components/link-list'

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-3 py-8 md:py-20">
      <header className="flex justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-base text-sm font-bold text-white">
            d
          </div>
          <span className="text-2xl font-bold text-blue-base">desafio prático 1</span>
        </div>
      </header>

      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div className="w-full md:max-w-sm">
          <LinkForm />
        </div>
        <div className="w-full flex-1">
          <LinkList />
        </div>
      </div>
    </main>
  )
}
