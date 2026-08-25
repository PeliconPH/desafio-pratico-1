import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '../env.ts'

const migrationClient = postgres(env.DATABASE_URL, { max: 1 })
const db = drizzle(migrationClient)

async function run() {
  console.log('Executando migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('Migrations concluídas.')
  await migrationClient.end()
}

run().catch((err) => {
  console.error('Erro nas migrations:', err)
  process.exit(1)
})
