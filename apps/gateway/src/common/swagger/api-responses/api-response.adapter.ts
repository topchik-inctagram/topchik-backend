import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
} from '../../../core/swagger/swagger.constants';
import { BadRequestResponse } from '../../../../../common/views/response.view';

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
  ) {
    return ApiOkResponse({
      description: description ?? OK,
      type,
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
    });
  }

  static getForbiddenResponse(description: string | null) {
    return ApiForbiddenResponse({
      description: description ?? FORBIDDEN,
    });
  }

  static getBadRequestResponse(description: string | null) {
    return ApiBadRequestResponse({
      description: description ?? BAD_REQUEST,
      type: BadRequestResponse,
    });
  }

  static getNotFoundResponse(description: string | null) {
    return ApiNotFoundResponse({
      description: description ?? NOT_FOUND,
    });
  }

  static getTooManyRequestsResponse(description: string | null) {
    return ApiTooManyRequestsResponse({
      description: description ?? TOO_MANY_REQUESTS,
    });
  }
}
