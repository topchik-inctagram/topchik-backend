import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from '../../features/users/user.module';
import { ContentModule } from '../../features/content/content.module';
import { ReferenceModule } from '../../features/reference/reference.module';

export const swaggerSetup = (app: INestApplication, apiPrefix: string) => {
  const options = new DocumentBuilder()
    .addServer(`/`)
    .addCookieAuth('refreshToken')
    .addBearerAuth({ type: 'http', description: 'Enter accessToken only' })
    .setTitle('Gateway')
    .setDescription('All endpoints in gateway')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, ContentModule, ReferenceModule],
  });
  SwaggerModule.setup(`${apiPrefix}/swagger/gateway`, app, document);
};
