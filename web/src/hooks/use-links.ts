import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createLink,
  deleteLink,
  listLinks,
  type CreateLinkInput,
  type Link,
} from '../lib/api'

const LINKS_KEY = ['links']

export function useLinks() {
  return useQuery({
    queryKey: LINKS_KEY,
    queryFn: listLinks,
  })
}

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLinkInput) => createLink(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_KEY })
      toast.success('Link criado com sucesso!')
    },
    onError: (error: unknown) => {
      const message = extractError(error)
      toast.error(message)
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (shortUrl: string) => deleteLink(shortUrl),
    // Interface otimista: remove da lista antes da confirmação do servidor.
    onMutate: async (shortUrl) => {
      await queryClient.cancelQueries({ queryKey: LINKS_KEY })
      const previous = queryClient.getQueryData<Link[]>(LINKS_KEY)
      queryClient.setQueryData<Link[]>(LINKS_KEY, (old) =>
        old?.filter((l) => l.shortUrl !== shortUrl)
      )
      return { previous }
    },
    onError: (_err, _shortUrl, context) => {
      if (context?.previous) {
        queryClient.setQueryData(LINKS_KEY, context.previous)
      }
      toast.error('Erro ao deletar o link.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_KEY })
    },
  })
}

function extractError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response?.data?.message === 'string'
  ) {
    return (error as any).response.data.message
  }
  return 'Ocorreu um erro inesperado.'
}
