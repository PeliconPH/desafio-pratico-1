import { stringify } from 'csv-stringify/sync'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { links } from '../db/schema.ts'
import { uploadCsv } from '../lib/storage.ts'

export class LinkAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um link com essa URL encurtada.')
    this.name = 'LinkAlreadyExistsError'
  }
}

export class LinkNotFoundError extends Error {
  constructor() {
    super('Link não encontrado.')
    this.name = 'LinkNotFoundError'
  }
}

export async function createLink(input: { originalUrl: string; shortUrl: string }) {
  const existing = await db.query.links.findFirst({
    where: eq(links.shortUrl, input.shortUrl),
  })

  if (existing) {
    throw new LinkAlreadyExistsError()
  }

  const [link] = await db.insert(links).values(input).returning()
  return link
}

export async function listLinks() {
  return db.select().from(links).orderBy(desc(links.createdAt))
}

export async function getLinkByShortUrl(shortUrl: string) {
  const link = await db.query.links.findFirst({
    where: eq(links.shortUrl, shortUrl),
  })

  if (!link) {
    throw new LinkNotFoundError()
  }

  return link
}

export async function incrementAccess(shortUrl: string) {
  const [link] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.shortUrl, shortUrl))
    .returning()

  if (!link) {
    throw new LinkNotFoundError()
  }

  return link
}

export async function deleteLink(shortUrl: string) {
  const [link] = await db.delete(links).where(eq(links.shortUrl, shortUrl)).returning()

  if (!link) {
    throw new LinkNotFoundError()
  }

  return link
}

export async function exportLinksCsv() {
  const rows = await db.select().from(links).orderBy(desc(links.createdAt))

  const csv = stringify(rows, {
    header: true,
    columns: {
      originalUrl: 'URL original',
      shortUrl: 'URL encurtada',
      accessCount: 'Acessos',
      createdAt: 'Data de criação',
    },
    cast: {
      date: (value) => value.toISOString(),
    },
  })

  const { url } = await uploadCsv(csv)
  return { url }
}
