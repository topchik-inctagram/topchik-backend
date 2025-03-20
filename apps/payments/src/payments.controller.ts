import { Controller, Get } from '@nestjs/common';

@Controller()
export class PaymentsController {
  constructor() {}

  @Get('health-check')
  checkHealth(): string {
    return 'OK';
  }
}
