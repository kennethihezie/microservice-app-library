import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigConstants } from '../constants/config.constants';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '../types/jwt-sign-options.types';

@Injectable()
export class AppJwtService {
  constructor(private readonly service: JwtService, private readonly configService: ConfigService) {}

  async generateJwtToken<T extends Object>(payload: T, signOptions?: JwtSignOptions) {
    const { secret, expiry } = signOptions

    const accessToken = await this.service.signAsync(payload, {
      secret: secret ?? this.configService.get<string>(ConfigConstants.JWT_SECRET),
      expiresIn: expiry ?? this.configService.get<string>(ConfigConstants.JWT_EXPIRY),
    });

    return accessToken;
  }

  async generateRefreshToken<T extends Object>(payload: Partial<T>, signOptions?: JwtSignOptions) {
    const { secret, expiry } = signOptions

    const refreshToken = await this.service.signAsync(payload, {
      secret: secret ?? this.configService.get<string>(ConfigConstants.JWT_REFRESH_SECRET),
      expiresIn: expiry ?? this.configService.get<string>(ConfigConstants.JWT_REFRESH_EXPIRES),
    });

    return refreshToken;
  }

  async verifyJwtToken<T extends Object>(token: string, signOptions?: JwtSignOptions): Promise<T> {
    const { secret } = signOptions

    const data = await this.service.verifyAsync<T>(token, {
      secret: secret ?? this.configService.get<string>(ConfigConstants.JWT_SECRET),
    });

    return data;
  }

  async verifyRefreshToken<T extends Object>(token: string, signOptions?: JwtSignOptions): Promise<T> {
    const { secret } = signOptions

    const data = await this.service.verifyAsync<T>(token, {
      secret: secret ?? this.configService.get<string>(ConfigConstants.JWT_SECRET),
    });

    return data;
  }
}