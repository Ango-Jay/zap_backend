import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'; // <-- Import NestModule and MiddlewareConsumer
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './api/notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { FileModule } from './api/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import configuration from './config/configuration';
import { LoggingMiddleware } from './common/middleware/logging.middleware'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env','.env.local'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    NotesModule,
    FileModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');       
  }
}