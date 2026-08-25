import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    originalUrl: text('original_url').notNull(),
    shortUrl: text('short_url').notNull().unique(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // index em created_at para listagem performática (ordenação desc)
    index('links_created_at_idx').on(table.createdAt),
  ]
)

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
