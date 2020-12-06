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

  public findById(id: string): Promise<any> {
    return this.repo.query(QUERY.GET_USER_BY_ID, [id])
  }

  public findUser(username: string): Promise<any> {
    return this.repo.query(`select * from users where email=$1`, [username])
  }

  public async save(user: any): Promise<any> {
    let result = await this.repo.query(
      QUERY.CREATE_USER,
      [user.id, user.full_name, user.email, user.key, user.super_admin, user.created_on]
    )

    return new Promise((res, _) => {
      let data = result[0]
      delete data.key
      res(data)
    })
  }

  public async update(user: any): Promise<any> {
    this.repo.createQueryBuilder('')
    let result = await this.repo.query(
      `update users set ${
        Object.keys(user)
          .filter(key => key !== 'id')
          .map((key, idx) => `${key}=$${idx+2}`)
          .join(',')
      } where id=$1 returning *`,
      Object.keys(user).map(key => user[key])
    )
    return new Promise((res, _) => {
      let data = result[0][0]
      delete data.key
      res(data)
    })
  }

  public checkEmail(email: string): Promise<any> {
    return this.repo.query(
      QUERY.CHECK_EMAIL,
      [email]
    )
  }

  public async delete(id: string): Promise<any> {
    return this.repo.query(
      QUERY.DELETE_USER_BY_ID, [id]
    )
  }
}
