import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { env, isStorageConfigured } from '../env.ts'

export interface UploadResult {
  key: string
  url: string
}

/**
 * Sobe um CSV para o storage e retorna a URL pública (CDN).
 * - Se as credenciais do Cloudflare R2 estiverem configuradas: sobe pro bucket.
 * - Caso contrário (dev sem credencial): grava em ./tmp e serve local via /uploads.
 * Nome do arquivo é sempre aleatório e único (uuid).
 */
export async function uploadCsv(content: string): Promise<UploadResult> {
  const key = `links-${randomUUID()}.csv`

  if (!isStorageConfigured) {
    return uploadLocal(key, content)
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  })

  const upload = new Upload({
    client,
    params: {
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      Body: content,
      ContentType: 'text/csv',
    },
  })

  await upload.done()

  const base = env.CLOUDFLARE_PUBLIC_URL.replace(/\/$/, '')
  return { key, url: `${base}/${key}` }
}

async function uploadLocal(key: string, content: string): Promise<UploadResult> {
  const dir = resolve(process.cwd(), 'tmp')
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, key), content, 'utf-8')
  return { key, url: `http://localhost:${env.PORT}/uploads/${key}` }
}
