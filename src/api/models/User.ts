import bcrypt from 'bcrypt'
import { IsBoolean, IsDate, IsUUID, IsEmail, IsNotEmpty } from 'class-validator'
import { Entity, PrimaryColumn } from 'typeorm'

interface IBaseUser {
  full_name: string
  email: string
}

@Entity()
export default class UserModel implements IBaseUser {
  @IsNotEmpty()
  public full_name: string

  @IsNotEmpty()
  @IsEmail()
  public email: string

  @IsNotEmpty()
  public key: string

  @PrimaryColumn('uuid')
  @IsNotEmpty()
  @IsUUID()
  public id: string

  @IsNotEmpty()
  @IsDate()
  public created_on: Date

  @IsNotEmpty()
  @IsBoolean()
  public super_admin: boolean

  constructor(full_name: string, email: string, key: string, id: string, created_on: Date, super_admin: boolean) {
    this.full_name = full_name
    this.email = email
    this.key = key
    this.id = id
    this.created_on = created_on
    this.super_admin = super_admin
  }

  public static hashkey(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(key, 10, (err, hash) => {
        if (err) {
          return reject(err)
        }
        resolve(hash)
      })
    })
  }

  public static compare(user: UserModel, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(key, user.key, (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(res === true)
      })
    })
  }
}
