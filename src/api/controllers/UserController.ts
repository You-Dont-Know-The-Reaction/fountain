import { Body, Get, JsonController, Param, Post, Put } from 'routing-controllers'
import { ResponseSchema } from 'routing-controllers-openapi'

import uuid from '../../lib/uuid'
import UserModel from '../models/User'
import UserService from '../services/UserService'
import UserResponse from './responses/UserResponse'
import UserRegisterBody from './requests/UserRegister'

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

  @Post()
  public register(@Body() user: UserRegisterBody): Promise<UserResponse|EmailAlreadyExist> {
    const userModel = new UserModel(
      user.full_name,
      user.email,
      user.key,
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
}
