import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';


@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: [`.env.stage.${process.env.STAGE}`],
          validationSchema: configValidationSchema,
          isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) : TypeOrmModuleOptions => ({
              type: 'postgres',
              url: configService.get<string>('DATABASE_URL'),
              autoLoadEntities: true,
              synchronize: true,
          }),
      }),
      TasksModule,
      AuthModule,

  ],

})
export class AppModule {}
