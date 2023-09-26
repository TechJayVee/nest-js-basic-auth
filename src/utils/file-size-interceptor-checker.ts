import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { extname } from 'path';

@Injectable()
export class FileSizeAndExtensionInterceptor implements NestInterceptor {
  constructor(
    private readonly maxSize: number,
    private readonly allowedExtensions: string[],
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    if (!request.file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Check file size
    if (request.file.size > this.maxSize) {
      throw new HttpException('File size is too large', HttpStatus.BAD_REQUEST);
    }

    // Check file extension
    const fileExt = extname(request.file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(fileExt)) {
      throw new HttpException('Invalid file extension', HttpStatus.BAD_REQUEST);
    }

    return next.handle();
  }
}
