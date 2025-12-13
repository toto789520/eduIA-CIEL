import crypto from 'crypto'

/**
 * Hash a password using SHA-256 with a salt
 * 
 * NOTE: For production use, consider using bcrypt, scrypt, or Argon2 
 * which are specifically designed for password hashing and include 
 * built-in protections against brute-force attacks.
 */
export function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT || 'eduIA-CIEL-default-salt-2024'
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}
