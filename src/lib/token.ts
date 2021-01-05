require('dotenv').config()
import jwt from 'jsonwebtoken'

export default function generateToken(email: string, id: string) {
  return jwt.sign(
    {
      email: email,
      user_id: id,
    },
    process.env.APP_KEY,
    {
      expiresIn: process.env.APP_EXPIRES_IN
    }
  )
}
