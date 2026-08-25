import axios from 'axios'
import { env } from '../env'

export const api = axios.create({
  baseURL: env.BACKEND_URL,
})

export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

export async function listLinks(): Promise<Link[]> {
  const { data } = await api.get<Link[]>('/links')
  return data
}

export async function getLinkByShortUrl(shortUrl: string): Promise<Link> {
  const { data } = await api.get<Link>(`/links/${shortUrl}`)
  return data
}

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const { data } = await api.post<Link>('/links', input)
  return data
}

export async function incrementAccess(shortUrl: string): Promise<Link> {
  const { data } = await api.patch<Link>(`/links/${shortUrl}/access`)
  return data
}

export async function deleteLink(shortUrl: string): Promise<void> {
  await api.delete(`/links/${shortUrl}`)
}

export async function exportLinksCsv(): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>('/links/exports')
  return data
}
