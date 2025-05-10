import { PipeTransform, Injectable } from '@nestjs/common';

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, group1) =>
          group1.toUpperCase(),
        );
        newObj[camelKey] = toCamelCase(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

@Injectable()
export class CamelCaseRequestPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') {
      return value;
    }
    return toCamelCase(value);
  }
}
