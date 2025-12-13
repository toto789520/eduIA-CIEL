import crypto from 'crypto'

export function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT || 'eduIA-CIEL-default-salt-2024'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}
