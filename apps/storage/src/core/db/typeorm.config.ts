import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getFilePath } from '../config/storage-configuration';
import { Environments } from '../../../../common/config/enviroment.settings';
import { AvatarEntity } from '../../features/images/domain/avatar.entity';
import { PostEntity } from '../../features/images/domain/post.entity';
import path from 'path';

config({ path: getFilePath(process.env.ENV as Environments) });

export default new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  migrations: [
    path.join('apps', 'storage', 'src', 'core', 'db', 'migrations', '*.ts'),
  ],
  entities: [AvatarEntity, PostEntity],
  ssl: process.env.ENV !== Environments.DEVELOPMENT,
  synchronize: false,
  logging: false,
});
