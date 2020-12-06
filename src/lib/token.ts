import jwt from 'jsonwebtoken'

export default function generateToken(email: string, id: string) {
  return jwt.sign(
    {
      email: email,
      user_id: id,
    },
    '02335555688888889',
    {
      expiresIn: '24h'
    }
  )
}
