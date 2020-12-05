import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import UserModel from '../models/User'
import UserResponse from '../controllers/responses/UserResponse'
import { UserRepository } from '../repositories/UserRepository'
import { events } from '../subscribers/events'
import EmailAlreadyExist from '../errors/EmailAlreadyExist'
import UserNotFoundError from '../errors/UserNotFoundError'

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
    return this.userRepository.findOne({ where: {id} })
  }

  public async create(user: UserModel): Promise<UserResponse|EmailAlreadyExist> {
    this.log.info('Creating a new user.')
    const is_email_already_exist = await this.userRepository.checkEmail(user.email)
    if (is_email_already_exist.length > 0) {
      this.log.warn('This email already exist => ', user.email.toString())
      return new EmailAlreadyExist()
    } else {
      const newUser = await this.userRepository.save(user)
      this.eventDispatcher.dispatch(events.user.created, newUser)
      return newUser
    }
  }

  public async update(id: string, user: any): Promise<UserResponse|any> {
    this.log.info('Updating a user.')
    const userDetail = await this.userRepository.findById(id)
    if (userDetail.length > 0) {
      user = { ...userDetail[0], ...user }
      return this.userRepository.update(user)
    } else {
      return new UserNotFoundError()
    }
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a user')
    await this.userRepository.delete(id)
    return
  }
}
