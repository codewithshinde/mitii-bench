import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const message = typeof response === "string" ? response : (response as { message?: string }).message;
    res.status(status).json({
      success: false,
      statusCode: status,
      message: message ?? exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
