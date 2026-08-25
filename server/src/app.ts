import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { linksRoutes } from './routes/links.ts'

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyCors, { origin: '*' })

  app.setErrorHandler((error, _request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        message: 'Erro de validação.',
        issues: error.validation,
      })
    }
    app.log.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor.' })
  })

  app.get('/health', async () => ({ status: 'ok' }))

  // Serve CSVs gerados localmente (fallback quando R2 não está configurado)
  app.get('/uploads/:file', async (request, reply) => {
    const { file } = request.params as { file: string }
    if (!/^links-[a-z0-9-]+\.csv$/.test(file)) {
      return reply.status(404).send({ message: 'Arquivo não encontrado.' })
    }
    try {
      const content = await readFile(resolve(process.cwd(), 'tmp', file), 'utf-8')
      return reply.header('Content-Type', 'text/csv').send(content)
    } catch {
      return reply.status(404).send({ message: 'Arquivo não encontrado.' })
    }
  })

  app.register(linksRoutes)

  return app
}
