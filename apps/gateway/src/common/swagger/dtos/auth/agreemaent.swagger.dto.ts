import { ApiProperty } from '@nestjs/swagger';

export const AgreementApiProperty = () =>
  ApiProperty({
    type: Boolean,
    description: 'Соглашение обязательно должно быть true',
    example: 'true',
    required: true,
  });
