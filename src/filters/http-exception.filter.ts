import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: 
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
    };

    // Ensure CORS headers are set even for errors
    response.header('Access-Control-Allow-Origin', 'https://anonyrant.vercel.app');
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    response.status(status).json(errorResponse);
  }
} 