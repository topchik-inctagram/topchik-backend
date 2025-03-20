import { Controller, Get } from '@nestjs/common';

@Controller()
export class UploadsController {
  @Get('health-check')
  checkHealth(): string {
    return 'OK';
  }
}
