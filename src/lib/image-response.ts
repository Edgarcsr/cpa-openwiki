import 'server-only'
import { readFile } from 'node:fs/promises'

export const imageResponse = async (
  image: { file: string; mime: string } | null,
  cacheControl: string
) => {
  if (!image) {
    return new Response('Not found', { status: 404 })
  }
  try {
    const data = await readFile(image.file)
    return new Response(new Uint8Array(data), {
      headers: { 'Content-Type': image.mime, 'Cache-Control': cacheControl },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
