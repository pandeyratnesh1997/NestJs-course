import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { Attendee } from './event/attendee.entity';
import { SchoolModule } from './school/school.module';
import { Teacher } from './school/teacher.entity';
import { Subject } from './school/subject.entity';
import { AuthModule } from './event/auth/auth.module';
import { User } from './event/auth/user.entity';
import { Profile } from './event/auth/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'nest-events',
      entities: [Event, Attendee, Teacher, Subject, User, Profile],
      synchronize: true,
    }),
    AuthModule,
    EventModule,
    SchoolModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService,
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest js backend',
    },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} Factory!`,
    },
    AppDummy,
  ],
})
export class AppModule {}
