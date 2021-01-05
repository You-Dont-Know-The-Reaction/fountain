import { Exclude } from 'class-transformer'
import UserModel from '../../models/User'

export default class UserResponse extends UserModel {
  @Exclude()
  public key: string
}
