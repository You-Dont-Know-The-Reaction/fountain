import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export default class User {
  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err)
        }
        resolve(hash)
      })
    })
  }

  public static comparePassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res === true)
      })
    })
  }
  @PrimaryColumn('uuid')
  public id: string

  @IsNotEmpty()
  @Column()
  @Exclude()
  public password: string
}
