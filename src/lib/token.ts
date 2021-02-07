require('dotenv').config()
import jwt from 'jsonwebtoken'

export default function generateToken(user: any) {
  return jwt.sign(
    {...user},
    process.env.APP_KEY,
    {
      expiresIn: process.env.APP_EXPIRES_IN
    }
  )
}
