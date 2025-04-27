import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import snakecaseKeys from 'snakecase-keys';
import { instanceToPlain } from 'class-transformer';

// function toSnakeCase(obj: any): any {
//   if (obj instanceof Date) {
//     return obj.toISOString();
//   } else if (Array.isArray(obj)) {
//     return obj.map(toSnakeCase);
//   } else if (obj !== null && typeof obj === 'object') {
//     const newObj: any = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
//         newObj[snakeKey] = toSnakeCase(obj[key]);
//       }
//     }
//     return newObj;
//   }
//   return obj;
// }

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('Data before plain:', data);

        const plainData = instanceToPlain(data);

        console.log('Data after plain:', plainData);

        return {
          status_code: 200,
          message: 'Success',
          data: snakecaseKeys(plainData, { deep: true }),
        };
      }),
    );
  }
}
