import { HttpError } from 'routing-controllers'

export default class EmailIDNotExist extends HttpError {
  constructor() {
    super(400, 'Email ID does not exist.')
  }
}
