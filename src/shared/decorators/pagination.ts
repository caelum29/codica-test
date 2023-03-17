import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces';

export interface PaginationData {
  offset: number;
  limit: number;
}
export const Pagination = createParamDecorator(
  (_1: CustomParamFactory, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let limit = parseInt(request.query.limit);
    let offset = parseInt(request.query.offset);

    if (
      (isNaN(limit) && request.query.limit) ||
      (isNaN(offset) && request.query.offset)
    ) {
      throw new HttpException('wrong pagination', HttpStatus.BAD_REQUEST);
    }

    limit = limit || 1;
    offset = offset || 0;

    if (limit < 1) {
      limit = 1;
    }

    if (offset < 0) {
      offset = 0;
    }

    return { limit, offset };
  },
);
