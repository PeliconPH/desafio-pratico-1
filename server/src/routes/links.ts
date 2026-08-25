import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  LinkAlreadyExistsError,
  LinkNotFoundError,
  createLink,
  deleteLink,
  exportLinksCsv,
  getLinkByShortUrl,
  incrementAccess,
  listLinks,
} from '../services/links.ts'

// short_url: apenas letras, números e hífen. Ex.: "meu-link", "portfolio-2024"
const shortUrlSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, 'A URL encurtada deve conter apenas letras minúsculas, números e hífen.')

const linkSchema = z.object({
  id: z.string().uuid(),
  originalUrl: z.string(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.date(),
})

export const linksRoutes: FastifyPluginAsyncZod = async (app) => {
  // Criar link
  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url('A URL original é inválida.'),
          shortUrl: shortUrlSchema,
        }),
        response: {
          201: linkSchema,
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const link = await createLink(request.body)
        return reply.status(201).send(link)
      } catch (err) {
        if (err instanceof LinkAlreadyExistsError) {
          return reply.status(409).send({ message: err.message })
        }
        throw err
      }
    }
  )

  // Listar todos os links
  app.get(
    '/links',
    {
      schema: {
        response: { 200: z.array(linkSchema) },
      },
    },
    async () => {
      return listLinks()
    }
  )

  // Obter URL original pela URL encurtada
  app.get(
    '/links/:shortUrl',
    {
      schema: {
        params: z.object({ shortUrl: z.string() }),
        response: {
          200: linkSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const link = await getLinkByShortUrl(request.params.shortUrl)
        return reply.send(link)
      } catch (err) {
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        throw err
      }
    }
  )

  // Incrementar acessos
  app.patch(
    '/links/:shortUrl/access',
    {
      schema: {
        params: z.object({ shortUrl: z.string() }),
        response: {
          200: linkSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const link = await incrementAccess(request.params.shortUrl)
        return reply.send(link)
      } catch (err) {
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        throw err
      }
    }
  )

  // Deletar link
  app.delete(
    '/links/:shortUrl',
    {
      schema: {
        params: z.object({ shortUrl: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        await deleteLink(request.params.shortUrl)
        return reply.status(204).send()
      } catch (err) {
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        throw err
      }
    }
  )

  // Exportar CSV (retorna URL da CDN)
  app.post(
    '/links/exports',
    {
      schema: {
        response: { 200: z.object({ url: z.string() }) },
      },
    },
    async () => {
      return exportLinksCsv()
    }
  )
}
