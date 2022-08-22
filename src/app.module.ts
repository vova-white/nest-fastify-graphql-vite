import { appConfig } from './app.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(appConfig.MONGO_URL), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
