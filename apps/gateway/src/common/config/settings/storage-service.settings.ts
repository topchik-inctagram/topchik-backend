import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class StorageServiceSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  STORAGE_UPLOAD_IMAGE_URL: string =
    this.environmentVariables.STORAGE_UPLOAD_IMAGE_URL;

  @IsString()
  STORAGE_UPLOAD_IMAGE_LIST_URL: string =
    this.environmentVariables.STORAGE_UPLOAD_IMAGE_LIST_URL;
}
