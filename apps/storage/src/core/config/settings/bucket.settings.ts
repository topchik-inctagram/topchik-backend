import { EnvironmentVariable } from '../storage-configuration';
import { IsString } from 'class-validator';

export class BucketSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  BUCKET_NAME: string = this.environmentVariables.BUCKET_NAME;

  @IsString()
  S3_REGION: string = this.environmentVariables.S3_REGION;

  @IsString()
  S3_ENDPOINT: string = this.environmentVariables.S3_ENDPOINT;

  @IsString()
  S3_KEY_ID: string = this.environmentVariables.S3_KEY_ID;

  @IsString()
  S3_KEY_SECRET: string = this.environmentVariables.S3_KEY_SECRET;

  @IsString()
  S3_PATH: string = this.environmentVariables.S3_PATH;
}
