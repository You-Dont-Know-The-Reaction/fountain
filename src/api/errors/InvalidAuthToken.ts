import { HttpError } from 'routing-controllers'

export default class InvalidAuthToken extends HttpError {
  constructor() {
    super(400, 'Invalid auth token provided.')
  }
}
