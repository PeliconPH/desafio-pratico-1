import { buildApp } from './app.ts'
import { env } from './env.ts'

const app = buildApp()

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`HTTP server rodando em http://localhost:${env.PORT}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
