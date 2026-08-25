import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { env } from '../env'
import { useCreateLink } from '../hooks/use-links'
import { SpinnerIcon } from './icons'

const shortHost = env.FRONTEND_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

const formSchema = z.object({
  originalUrl: z.string().min(1, 'Informe uma URL.').url('Informe uma URL válida.'),
  shortUrl: z
    .string()
    .min(1, 'Informe uma URL encurtada.')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen.'),
})

type FormData = z.infer<typeof formSchema>

export function LinkForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const createLink = useCreateLink()

  async function onSubmit(data: FormData) {
    await createLink.mutateAsync(data, {
      onSuccess: () => reset(),
    })
  }

  const disabled = isSubmitting || createLink.isPending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="originalUrl"
          className={`text-xs font-bold uppercase ${errors.originalUrl ? 'text-danger' : 'text-gray-500'}`}
        >
          Link original
        </label>
        <input
          id="originalUrl"
          type="text"
          placeholder="www.exemplo.com.br"
          disabled={disabled}
          className={`rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-base disabled:opacity-60 ${
            errors.originalUrl ? 'border-danger' : 'border-gray-300'
          }`}
          {...register('originalUrl')}
        />
        {errors.originalUrl && (
          <span className="text-xs text-danger">{errors.originalUrl.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="shortUrl"
          className={`text-xs font-bold uppercase ${errors.shortUrl ? 'text-danger' : 'text-gray-500'}`}
        >
          Link encurtado
        </label>
        <div
          className={`flex items-center rounded-lg border px-4 py-3 transition focus-within:border-blue-base ${
            errors.shortUrl ? 'border-danger' : 'border-gray-300'
          }`}
        >
          <span className="text-sm text-gray-400">{shortHost}/</span>
          <input
            id="shortUrl"
            type="text"
            disabled={disabled}
            className="flex-1 bg-transparent text-sm outline-none disabled:opacity-60"
            {...register('shortUrl')}
          />
        </div>
        {errors.shortUrl && (
          <span className="text-xs text-danger">{errors.shortUrl.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-base px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled && <SpinnerIcon className="h-4 w-4" />}
        Salvar link
      </button>
    </form>
  )
}
