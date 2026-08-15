import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          'mongodb+srv://tsheposibiya_db_user:R6xsjnXmHJzd8xBe@cluster0.ci6f0vm.mongodb.net/fleetflow_db?appName=Cluster0';
        return {
          uri,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
