import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TransformBooleanPipe implements PipeTransform {
  transform(value: any) {
    // Handle the entire body object
    if (value && typeof value === 'object') {
      // Transform the 'active' field if it exists
      if ('active' in value) {
        const activeValue = value.active;
        if (typeof activeValue === 'string') {
          const lowerValue = activeValue.toLowerCase();
          if (lowerValue === 'true') {
            value.active = true;
          } else if (lowerValue === 'false') {
            value.active = false;
          } else {
            throw new BadRequestException('Active must be a boolean value (true/false)');
          }
        } else if (typeof activeValue !== 'boolean') {
          throw new BadRequestException('Active must be a boolean value');
        }
      }
    }
    return value;
  }
}