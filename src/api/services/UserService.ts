import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import UserModel from '../models/User'
import LoginResponse from '../controllers/responses/LoginResponse'
import UserResponse from '../controllers/responses/UserResponse'
import { UserRepository } from '../repositories/UserRepository'
import { events } from '../subscribers/events'
import generateToken from '../../lib/token'

import EmailIDNotExist from '../errors/EmailIDNotExist'
import InvalidPassword from '../errors/InvalidPassword'
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

  public async findOne(id: string): Promise<UserResponse|UserNotFoundError> {
    this.log.info('Find one user')
    const userDetail = await this.userRepository.findById(id)
    if (userDetail.length > 0) {
      delete userDetail[0].key
      return new Promise((res, _) => res(userDetail[0]))
    } else {
      return new UserNotFoundError()
    }
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

  public async delete(id: string): Promise<string|UserNotFoundError> {
    this.log.info('Delete a user')
    const userDetail = await this.userRepository.findById(id)
    if (userDetail.length > 0) {
      const res = await this.userRepository.delete(id)
      this.log.info(JSON.stringify(res))
      return 'User details deleted successfully.'
    } else {
      return new UserNotFoundError()
    }
  }

  public async login(username: string, key: string): Promise<LoginResponse|InvalidPassword|EmailIDNotExist> {
    const user = await this.userRepository.findUser(username)

    if (user.length > 0) {
      if (await UserModel.compare(user[0].key, key)) {
        delete user[0].key
        return {
          // user: user[0],
          token: generateToken(user)
        }
      } else {
        return new InvalidPassword()
      }
    } else {
      return new EmailIDNotExist()
    }
  }
}
