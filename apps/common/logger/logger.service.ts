import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  private customContext = 'Global';

  constructor() {
    super();
  }

  /**
   * Устанавливает контекст для логгера.
   * @param context - Имя класса или сервиса.
   */
  setContext(context: string): void {
    this.customContext = context;
  }

  log(message: string) {
    super.log(`\x1b[34m[${this.customContext}]\x1b[0m ${message}`);
  }

  error(message: string, trace?: string) {
    super.error(
      `\x1b[31m[${this.customContext}]\x1b[0m ${message} ${trace ? `\nTrace: ${trace}` : ''}`,
    );
  }

  warn(message: string) {
    super.warn(`\x1b[33m[${this.customContext}]\x1b[0m ${message}`);
  }

  debug(message: string) {
    super.debug(`\x1b[36m[${this.customContext}]\x1b[0m ${message}`);
  }

  verbose(message: string) {
    super.verbose(`\x1b[35m[${this.customContext}]\x1b[0m ${message}`);
  }
}
