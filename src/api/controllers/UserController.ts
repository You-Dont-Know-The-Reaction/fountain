import { Body, Get, JsonController, Post } from 'routing-controllers'
import { ResponseSchema } from 'routing-controllers-openapi'

import uuid from '../../lib/uuid'
import UserModel from '../models/User'
import UserService from '../services/UserService'
import UserResponse from './responses/UserResponse'
import UserRequestBody from './requests/UserRegister'

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
  public async register(@Body() user: UserRequestBody): Promise<UserResponse> {
    return this.userService.create(new UserModel(user.full_name, user.email, user.key, uuid(), new Date(), false))
  }
}
