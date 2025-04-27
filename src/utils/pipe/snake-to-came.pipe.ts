import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

function convertObjectKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertObjectKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = snakeToCamel(key);
      newObj[camelKey] = convertObjectKeysToCamelCase(obj[key]);
    }
    return newObj;
  }
  return obj;
}

@Injectable()
export class SnakeToCamelPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    try {
      const result = convertObjectKeysToCamelCase(value);
      console.log('✅ Data after converting snake_case to camelCase:', result);
      return result;
    } catch (error) {
      console.error('❌ Error while converting request snake_case:', error);
      throw new BadRequestException('Request body không hợp lệ');
    }
  }
}
