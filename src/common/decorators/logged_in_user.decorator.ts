import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface ILoggedInUser {
  _id: string;
  email: string;
}

export const LoggedInUserDecorator = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
