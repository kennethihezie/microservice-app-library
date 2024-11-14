import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/*
 Provides the current authenticated user across the app.
*/

export const CurrentUser = <T>() => createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as T;
  },
);