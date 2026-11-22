// Redefine a senha de uma conta direto no banco (para quem ficou sem acesso).
//
//   bun run reset-password <email> <nova-senha>
//
// Roda no servidor, com acesso ao arquivo data/openwiki.db. Encerra as sessões
// abertas dessa conta.
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { hashPassword } from 'better-auth/crypto'

const MIN_PASSWORD_LENGTH = 8

const [email, password] = process.argv.slice(2)

if (!email || !password) {
  console.error('Uso: bun run reset-password <email> <nova-senha>')
  process.exit(1)
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(
    `A senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
  )
  process.exit(1)
}

const db = new DatabaseSync(path.join(process.cwd(), 'data', 'openwiki.db'))
const user = db
  .prepare('SELECT id, name FROM user WHERE lower(email) = lower(?)')
  .get(email) as { id: string; name: string } | undefined

if (!user) {
  console.error(`Nenhuma conta com o e-mail ${email}.`)
  process.exit(1)
}

const hash = await hashPassword(password)
const result = db
  .prepare(
    "UPDATE account SET password = ?, updatedAt = ? WHERE userId = ? AND providerId = 'credential'"
  )
  .run(hash, new Date().toISOString(), user.id)

if (Number(result.changes) === 0) {
  console.error('Essa conta não tem login por senha.')
  process.exit(1)
}

db.prepare('DELETE FROM session WHERE userId = ?').run(user.id)
console.log(`Senha de ${user.name} (${email}) redefinida.`)
