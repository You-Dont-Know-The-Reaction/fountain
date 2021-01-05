import { HttpError } from 'routing-controllers'

export default class EmailAlreadyExist extends HttpError {
  constructor() {
    super(400, 'Email already exist.')
  }
}
