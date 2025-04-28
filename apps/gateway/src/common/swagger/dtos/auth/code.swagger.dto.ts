import { ApiProperty } from '@nestjs/swagger';

export const CodeApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Код подтверждения.',
    required: true,
  });
