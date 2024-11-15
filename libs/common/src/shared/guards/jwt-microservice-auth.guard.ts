import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVICE, AUTHENTICATE_ROUTE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { AppHelper } from "../helpers/app.helper";
import { Observable, tap, map, catchError, of } from "rxjs";
import { UserType } from "../types/user.type";

// Uses microservice message pattern to verify user
@Injectable()
export class JwtMicroServiceAuthGuard implements CanActivate {
  /* The ClientProxy allows us to communicate with other microservices */
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}


  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = AppHelper.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    return this.client.send<UserType>(AUTHENTICATE_ROUTE, { token }).pipe(
      // Tap allows performing side-effects without altering the emitted data.
      tap((user: UserType) => {
        request.user = user;
      }),
      
      // Map to true to indicate successful authentication if the user is retrieved
      map((user: UserType) => !!user),

      // Catch errors if needed
      catchError((err) => {
          console.error('Error during authentication:', err);
          return of(false); // Return false in case of an error
      })
  );
  }
}