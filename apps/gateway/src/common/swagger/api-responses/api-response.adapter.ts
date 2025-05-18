import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from '../swagger.constants';
import { ErrorResponse } from '../../../../../common/views/response.view';

export abstract class ApiResponseAdapter {
  static getSummary(summary: string = 'Some summary') {
    return ApiOperation({
      summary,
    });
  }

  static getBearerAuth() {
    return ApiBearerAuth();
  }

  static getCookieAuth() {
    return ApiCookieAuth();
  }

  static getOkResponse<T extends Function>(
    description: string | null,
    type?: T,
    isArray?: boolean,
  ) {
    return ApiOkResponse({
      description: description ?? OK,
      type,
      isArray: isArray ? true : false,
    });
  }

  static getCreatedResponse<T extends Function>(
    description: string | null,
    type?: T,
  ) {
    return ApiCreatedResponse({
      description: description ?? CREATED,
      type,
    });
  }

  static getNoContentResponse(description: string | null) {
    return ApiNoContentResponse({
      description: description ?? NO_CONTENT,
    });
  }

  static getUnauthorizedResponse(description: string | null) {
    return ApiUnauthorizedResponse({
      description: description ?? UNAUTHORIZED,
      type: ErrorResponse,
    });
  }

  static getForbiddenResponse(description: string | null) {
    return ApiForbiddenResponse({
      description: description ?? FORBIDDEN,
      type: ErrorResponse,
    });
  }

  static getBadRequestResponse(description: string | null) {
    return ApiBadRequestResponse({
      description: description ?? BAD_REQUEST,
      type: ErrorResponse,
    });
  }

  static getNotFoundResponse(description: string | null) {
    return ApiNotFoundResponse({
      description: description ?? NOT_FOUND,
      type: ErrorResponse,
    });
  }

  static getTooManyRequestsResponse(description: string | null) {
    return ApiTooManyRequestsResponse({
      description: description ?? TOO_MANY_REQUESTS,
    });
  }

  static getImageBodyResponse(description: string | null) {
    return [
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description,
        required: true,
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      }),
    ];
  }

  static getImageListBodyResponse(description: string | null) {
    return [
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description,
        required: true,
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              format: 'binary',
            },
          },
        },
      }),
    ];
  }
}
