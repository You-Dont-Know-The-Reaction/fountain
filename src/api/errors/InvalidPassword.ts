import { HttpError } from 'routing-controllers'

export default class InvalidPassword extends HttpError {
  constructor() {
    super(400, 'Invalid Password.')
  }
}
