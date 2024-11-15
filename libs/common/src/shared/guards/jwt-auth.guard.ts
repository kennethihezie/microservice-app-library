import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AppHelper } from "../helpers/app.helper";
import { AppJwtService } from "../services/jwt.service";
import { UserType } from "../types/user.type";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly appJwtService: AppJwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = AppHelper.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException('Token is required')

        const payload = await this.appJwtService.verifyJwtToken<UserType>(token)

        if(!payload) throw new UnauthorizedException('Invalid or malformed token')

        request.user = payload

        return true
    }
}