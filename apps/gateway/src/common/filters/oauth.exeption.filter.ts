import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomOAuthError } from '../exeptions/oauth.exeption';

@Catch(CustomOAuthError)
export class CustomOAuthExceptionFilter implements ExceptionFilter {
  catch(exception: CustomOAuthError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();
    const origin = 'https://inctagram.world';

    const redirectUrl = `${origin}/auth/sign-up`;
    console.error(exception);
    return response.redirect(redirectUrl);
  }
}
