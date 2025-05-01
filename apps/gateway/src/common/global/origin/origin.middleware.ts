import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { FrontRedirectSettings } from '../../config/settings/front-redirect.settings';
import { AsyncStorageAdapter } from '../../adapters/local-storage/local-storage.adapter';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  config: FrontRedirectSettings;

  constructor(
    private readonly asyncStorageService: AsyncStorageAdapter,
    private readonly configService: ConfigService<Configuration, true>,
  ) {
    this.config = this.configService.get('frontRedirectSettings');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin ?? this.config.PROD_DOMAIN;

    console.log(
      '*********************************************************************************',
    );
    console.log('URL', req.originalUrl);
    console.log('ORIGIN', origin);
    console.log('TOKEN:', req?.cookies?.refreshToken);

    this.asyncStorageService.run(() => {
      this.asyncStorageService.set('origin', origin);
      next();
    });
  }
}
