import { applyDecorators } from '@nestjs/common';
import { ApiResponseAdapter } from './api-response.adapter';
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
  FORBIDDEN_STATUS,
  NO_CONTENT_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
  TOO_MANY_REQUESTS_STATUS,
  UNAUTHORIZED_STATUS,
} from '../swagger.constants';

const AUTH_BEARER = 'bearer';
const AUTH_COOKIE = 'cookie';

const ONE_IMAGE = 'one_image';
const MANY_IMAGE = 'many_images';

type SuccessResponse<B = null> = {
  message: string;
  body: B;
  array?: boolean;
};

type ApiResponses<B = null> = {
  [OK_STATUS]: Partial<SuccessResponse<B>>;
  [CREATED_STATUS]: Partial<SuccessResponse<B>>;
  [NO_CONTENT_STATUS]: string;
  [BAD_REQUEST_STATUS]: string;
  [UNAUTHORIZED_STATUS]: string;
  [FORBIDDEN_STATUS]: string;
  [NOT_FOUND_STATUS]: string;
  [TOO_MANY_REQUESTS_STATUS]: string;

  [AUTH_BEARER]: boolean;
  [AUTH_COOKIE]: boolean;
  // basic: boolean;
  // role: boolean;

  [ONE_IMAGE]: string;
  [MANY_IMAGE]: string;
};

export function ApiResponseFactory<T>(
  summary: string,
  apiResponses: Partial<ApiResponses<T>>,
) {
  const apiResponsesKeys = Object.keys(apiResponses);

  const responses: any[] = [];

  for (const apiResponse of apiResponsesKeys) {
    const response = apiResponses[apiResponse];

    switch (apiResponse) {
      case OK_STATUS:
        responses.push(
          ApiResponseAdapter.getOkResponse(
            response?.message,
            response?.body,
            response?.array,
          ),
        );
        break;
      case CREATED_STATUS:
        responses.push(
          ApiResponseAdapter.getCreatedResponse(
            response?.message,
            response?.body,
          ),
        );
        break;
      case NO_CONTENT_STATUS:
        responses.push(ApiResponseAdapter.getNoContentResponse(response));
        break;
      case BAD_REQUEST_STATUS:
        responses.push(ApiResponseAdapter.getBadRequestResponse(response));
        break;
      case UNAUTHORIZED_STATUS:
        responses.push(ApiResponseAdapter.getUnauthorizedResponse(response));
        break;
      case FORBIDDEN_STATUS:
        responses.push(ApiResponseAdapter.getForbiddenResponse(response));
        break;
      case NOT_FOUND_STATUS:
        responses.push(ApiResponseAdapter.getNotFoundResponse(response));
        break;
      case TOO_MANY_REQUESTS_STATUS:
        responses.push(ApiResponseAdapter.getTooManyRequestsResponse(response));
        break;

      case AUTH_BEARER:
        responses.push(ApiResponseAdapter.getBearerAuth());
        break;
      case AUTH_COOKIE:
        responses.push(ApiResponseAdapter.getCookieAuth());
        break;

      case ONE_IMAGE:
        responses.push(...ApiResponseAdapter.getImageBodyResponse(response));
        break;
      case MANY_IMAGE:
        responses.push(
          ...ApiResponseAdapter.getImageListBodyResponse(response),
        );
        break;
    }
  }

  return applyDecorators(ApiResponseAdapter.getSummary(summary), ...responses);
}
