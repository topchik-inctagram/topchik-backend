import { EnvironmentVariable } from './configuration';
import { IsString } from 'class-validator';

export class StorageServiceSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  STORAGE_AVATAR_URL: string = this.environmentVariables.STORAGE_AVATAR_URL;
  @IsString()
  STORAGE_POSTS_URL: string = this.environmentVariables.STORAGE_POSTS_URL;
}
