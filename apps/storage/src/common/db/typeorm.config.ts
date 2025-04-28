import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getFilePath } from '../config/storage-configuration';
import { Environments } from '../../../../common/config/enviroment.settings';
import path from 'path';
import { ImageEntity } from '../../modules/images/domain/image.entity';

config({ path: getFilePath(process.env.ENV as Environments) });

export default new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  migrations: [
    path.join('apps', 'storage', 'src', 'common', 'db', 'migrations', '*.ts'),
  ],
  entities: [ImageEntity],
  ssl: process.env.ENV !== Environments.DEVELOPMENT,
  synchronize: false,
  logging: false,
});
