import { IsNotEmpty, IsEmail } from 'class-validator'

export default class UserRequestBody {
  @IsNotEmpty()
  public full_name: string

  @IsNotEmpty()
  @IsEmail()
  public email: string

  @IsNotEmpty()
  public key: string
}
