import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Environments } from '../../../../common/config/enviroment.settings';
import path from 'path';
import { getFilePath } from '../config/configuration';
import { referenceModuleEntities } from '../../modules/reference/reference.module';
import { globalModuleEntities } from '../global/global.module';
import { userModuleEntities } from '../../modules/users/user.module';
import { contentModuleEntities } from '../../modules/content/content.module';

config({ path: getFilePath(process.env.ENV as Environments) });

const entities = [
  ...userModuleEntities,
  ...contentModuleEntities,
  ...referenceModuleEntities,
  ...globalModuleEntities,
];

export default new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  migrations: [
    path.join('apps', 'gateway', 'src', 'common', 'db', 'migrations', '*.ts'),
  ],
  entities,
  ssl: process.env.ENV !== Environments.DEVELOPMENT,
  synchronize: false,
  logging: false,
});
