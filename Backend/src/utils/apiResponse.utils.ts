import { httpStatusCode } from '../config/http.config';

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: httpStatusCode;
}

export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public statusCode: httpStatusCode;

  constructor(statusCode: httpStatusCode, message: string, data?: T) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
