import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const query = request.query;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const sortBy = query.sortBy || 'id';
    const order =
      (query.order || 'asc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    request.pagination = {
      page,
      limit,
      offset: (page - 1) * limit,
      sortBy,
      order,
    };

    return next.handle();
  }
}
