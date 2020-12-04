import { EntityRepository, Repository } from 'typeorm'

import QUERY from '../Query'
import UserModel from '../models/User'

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel>  {
  constructor(
    private repo: Repository<any>
  ) {
    super()
  }

  public find(): Promise<any> {
    return this.repo.query(QUERY.LIST_USERS, [])
  }

  public save(user: any): Promise<any> {
    return this.repo.query(
      QUERY.CREATE_USER,
      [user.id, user.full_name, user.email, user.key, user.super_admin, user.created_on]
    )
  }

  public checkEmail(email: string): Promise<any> {
    return this.repo.query(
      QUERY.CHECK_EMAIL,
      [email]
    )
  }
}
