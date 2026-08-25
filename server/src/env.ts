import { z } from 'zod'

// Carrega variáveis do .env em dev (em produção as envs vêm do ambiente/container).
try {
  process.loadEnvFile()
} catch {
  // .env ausente — segue com as envs do processo
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional().default(''),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().optional().default(''),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional().default(''),
  CLOUDFLARE_BUCKET: z.string().optional().default(''),
  CLOUDFLARE_PUBLIC_URL: z.string().optional().default(''),
})

export const env = envSchema.parse(process.env)

export const isStorageConfigured =
  !!env.CLOUDFLARE_ACCOUNT_ID &&
  !!env.CLOUDFLARE_ACCESS_KEY_ID &&
  !!env.CLOUDFLARE_SECRET_ACCESS_KEY &&
  !!env.CLOUDFLARE_BUCKET
