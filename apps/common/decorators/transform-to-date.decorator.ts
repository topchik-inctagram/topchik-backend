import { Transform } from 'class-transformer';
import { BadRequestError } from '../exeptions/custom.exeption';

export function TransformToDate() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const [day, month, year] = value.split('/').map(Number);
    if (!day || !month || !year) {
      throw new BadRequestError(
        `Date must be in the format DD/MM/YYYY`,
        'dateOfBirth',
      );
    }

    return new Date(year, month - 1, day);
  });
}
