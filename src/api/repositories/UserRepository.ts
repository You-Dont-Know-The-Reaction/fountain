import { EntityRepository, Repository } from 'typeorm'

import User from '../models/User'

@EntityRepository(User)
export class UserRepository extends Repository<User>  {
  constructor(
    private repo: Repository<any>
  ) {
    super()
  }

  public find(): Promise<any> {
    return this.repo.query(`select * from users`, [])
  }
}
