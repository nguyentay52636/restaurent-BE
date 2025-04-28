import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';

function toCamelCase(obj: any): any {
  if (obj instanceof Date) {
    return obj.toISOString();
  } else if (Array.isArray(obj)) {
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
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('Data before plain:', data);

        const plainData = instanceToPlain(data);
        console.log('Data after plain:', plainData);

        const camelCaseData = toCamelCase(plainData);

        return {
          statusCode: 200,
          message: 'Success',
          data: camelCaseData,
        };
      }),
    );
  }
}
