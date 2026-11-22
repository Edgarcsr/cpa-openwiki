import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { zip } from 'fflate'
import type { Zippable } from 'fflate'

import { forbidden, unauthorized } from '@/lib/api'
import { getSession, isAdmin } from '@/lib/session'
import { CONTENT_DIR, listBackupFiles } from '@/lib/store'

const IMAGE_FILE = /\.(?:webp|png|jpg)$/u
const STORE_ONLY = 0

const zipAsync = promisify(zip)

// Backup: .zip com content/articles e content/proposals (textos e fotos). Para
// restaurar, é só extrair dentro de content/ no servidor.
export const GET = async (request: Request) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }
  if (!isAdmin(session)) {
    return forbidden()
  }

  const names = await listBackupFiles()
  const entries = await Promise.all(
    names.map(async (name) => {
      const data = new Uint8Array(await readFile(path.join(CONTENT_DIR, name)))
      // Fotos já são comprimidas; guardar sem recomprimir é mais rápido.
      const options = IMAGE_FILE.test(name) ? { level: STORE_ONLY } : {}
      return [name, [data, options]] as const
    })
  )
  const archive = await zipAsync(Object.fromEntries(entries) as Zippable)

  const date = new Date().toISOString().slice(0, 10)
  return new Response(new Uint8Array(archive), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="openwiki-backup-${date}.zip"`,
      'Cache-Control': 'no-store',
    },
  })
}
