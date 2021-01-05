import { Body, Delete, Get, HeaderParam, JsonController, Param, Post, Put } from 'routing-controllers'
import { ResponseSchema } from 'routing-controllers-openapi'

import uuid from '../../lib/uuid'
import UserModel from '../models/User'
import UserService from '../services/UserService'
import UserResponse from './responses/UserResponse'
import UserRegisterBody from './requests/UserRegister'

import InvalidAuthToken from '../errors/InvalidAuthToken'
import EmailAlreadyExist from '../errors/EmailAlreadyExist'
import UserNotFoundError from '../errors/UserNotFoundError'

@JsonController('/user')
export default class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get()
  @ResponseSchema(UserResponse, { isArray: true })
  public getAll(): Promise<UserResponse[]> {
    return this.userService.find()
  }

  @Get('/login')
  public async login(@HeaderParam('authorization') token: string): Promise<any|InvalidAuthToken> {
    if (token && token.split(' ')[0] === 'Bearer') {
      const decodedBase64 = Buffer.from(token.split(' ')[1], 'base64').toString('ascii')
      const username = decodedBase64.split(':')[0]
      const key = decodedBase64.split(':')[1]
      if (username && key) {
        return this.userService.login(username, key)
      } else {
        return new InvalidAuthToken()
      }
    } else {
      return new InvalidAuthToken()
    }
  }

  @Get('/:id')
  public getDetails(
    @Param('id') id: string,
  ): Promise<UserResponse|UserNotFoundError> {
    return this.userService.findOne(id)
  }

  @Post()
  public async register(@Body() user: UserRegisterBody): Promise<UserResponse|EmailAlreadyExist> {
    const key = await UserModel.hashkey(user.key)
    const userModel = new UserModel(
      user.full_name,
      user.email,
      key,
      uuid(),
      new Date(),
      false
    )
    return this.userService.create(userModel)
  }

  @Put('/:id')
  public async updateUserDetails(
    @Param('id') id: string,
    @Body() user: any
  ): Promise<UserResponse|UserNotFoundError> {
    return this.userService.update(id, user)
  }

  @Delete('/:id')
  public async remove(
    @Param('id') id:string
  ): Promise<string|UserNotFoundError> {
    return this.userService.delete(id)
  }
}
