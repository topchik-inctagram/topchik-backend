import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  USER_MAX_AGE,
  USER_MIN_AGE,
} from '../../../../../core/constants/dto.constants';

@ValidatorConstraint({ name: 'isAgeValid', async: false })
export class IsAgeValidConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: string): boolean {
    if (!dateOfBirth) return true;

    const age = this.calculateAge(new Date(dateOfBirth));

    return age >= USER_MIN_AGE && age < USER_MAX_AGE;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();

    console.log(birthDate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  defaultMessage(args: ValidationArguments): string {
    const dateOfBirth: string = args.value ?? null;
    const age = dateOfBirth ? this.calculateAge(new Date(dateOfBirth)) : null;

    if (age < USER_MIN_AGE) {
      return 'A user under 13 cannot create a profile';
    }
    if (age > USER_MAX_AGE) {
      return `The user's age cannot be more than 100 years old`;
    }
    return `Error in dateOfBirth`;
  }
}

export function IsAgeValid(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'isAgeValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAgeValidConstraint,
    });
  };
}
