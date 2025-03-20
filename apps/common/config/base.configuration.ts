import { ValidateNested, validateSync } from 'class-validator';
import { ApiSettings } from './api.settings';
import { EnvironmentSettings } from './enviroment.settings';
import { DatabaseSettings } from './data-base.settings';

export class BaseConfiguration {
  @ValidateNested()
  apiSettings: ApiSettings;
  @ValidateNested()
  environmentSettings: EnvironmentSettings;
  @ValidateNested()
  databaseSettings: DatabaseSettings;

  protected checkError() {
    const errors = validateSync(this, { skipMissingProperties: false });
    if (errors.length > 0) {
      throw new Error(
        `Error in ${this.environmentSettings.currentEnv}: ${JSON.stringify(
          errors.map((er) => ({
            property: er.property,
            error: `${er.children[0].property} is ${JSON.stringify(er.children[0].value)}`,
          })),
        )} `,
      );
    }
    return;
  }
}
