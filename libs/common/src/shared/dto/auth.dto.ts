import { IsJWT, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsJWT()
  token: string;
}
