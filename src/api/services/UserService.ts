import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import UserModel from '../models/User'
import UserResponse from '../controllers/responses/UserResponse'
import { UserRepository } from '../repositories/UserRepository'
import { events } from '../subscribers/events'

@Service()
export default class UserService {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  public find(): Promise<UserResponse[]> {
    this.log.info('Find all users')
    return this.userRepository.find()
  }

  public findOne(id: string): Promise<UserResponse> {
    this.log.info('Find one user')
    return this.userRepository.findOne({ id })
  }

  public async create(user: UserModel): Promise<UserResponse|any> {
    this.log.info('Create a new user => ', user.toString())
    const is_email_already_exist = await this.userRepository.checkEmail(user.email)
    if (is_email_already_exist.length > 0) {
      // TDO: Send a proper error instance.
      return 'Email already registered.'
    }
    else {
      const newUser = await this.userRepository.save(user)
      this.eventDispatcher.dispatch(events.user.created, newUser)
      return newUser
    }
  }

  public update(id: string, user: UserModel): Promise<UserResponse> {
    this.log.info('Update a user')
    user.id = id
    return this.userRepository.save(user)
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a user')
    await this.userRepository.delete(id)
    return
  }
}
