import { ConfigService } from '@nestjs/config';

export const dbConfig = (configService: ConfigService) => (
  {
    uri: configService.get<string>('MONGODB_URL'),
    dbName: configService.get<string>('DB_NAME'),
  }
)
