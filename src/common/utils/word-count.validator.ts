import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'wordCount', async: false })
export class WordCountValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (!value) return false;
    const words = value.trim().split(/\s+/);
    const maxWords = args.constraints[0];
    return words.length <= maxWords;
  }

  defaultMessage(args: ValidationArguments) {
    const maxWords = args.constraints[0];
    return `Field ${args.property} must not exceed ${maxWords} words`;
  }
}

export default WordCountValidator;