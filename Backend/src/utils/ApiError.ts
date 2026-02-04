import { httpStatusCode } from '../config/http.config'

class ApiError extends Error {
  public statusCode: httpStatusCode
  public message: string

  constructor(message: string, statusCode: httpStatusCode) {
    super(message)
    this.statusCode = statusCode
    this.message = message

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
