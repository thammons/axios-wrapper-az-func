import { HttpResponseInit } from '@azure/functions';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  createExceptionResponse,
}

export default HttpStatus;

export function createOkResponse(
  obj?: any,
  status?: HttpStatus
): HttpResponseInit {
  return { status: status ?? HttpStatus.OK, ...obj };
}

export function createMethodNotFoundResponse(): HttpResponseInit {
  return createExceptionResponse(
    HttpStatus.NOT_IMPLEMENTED,
    'Method Not Implemented'
  );
}

export function createBadRequestResponse(additionalDetail?: string): HttpResponseInit {
  return createExceptionResponse(HttpStatus.BAD_REQUEST, additionalDetail ?? 'Bad Request');
}

export function createUnauthorizedResponse(additionalDetail?: string): HttpResponseInit {
  return createExceptionResponse(
    HttpStatus.UNAUTHORIZED,
    additionalDetail ?? 'Not Authorized for Action'
  );
}

export function createExceptionResponse(
  code: number,
  message: string,
  obj?: any
): HttpResponseInit {
  console.error('Exception: ', message, obj);
  return {
    status: code,
    jsonBody: {
      error: {
        message: message,
        code: code,
      },
      ...obj,
    },
  };
}
