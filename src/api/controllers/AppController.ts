import { Get, JsonController } from 'routing-controllers'
import { ResponseSchema } from 'routing-controllers-openapi'

class AppResponse {
  public name: string
  public message: string
  public version: string
}

@JsonController('/app')
export default class App {
  constructor() {}

  @Get('/')
  @ResponseSchema(
    AppResponse,
    {
      contentType: 'application/json',
      statusCode: 200,
      description: 'Send a welcome message and show some info about the system.'
    }
  )
  public sendInfo() {
    return {
      name: 'Clove',
      version: 'v0.1.0',
      message: 'Welcome to Clove services.'
    }
  }
}
