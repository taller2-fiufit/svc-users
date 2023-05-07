import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ProducerService } from './producer.service';

@Module({
  imports: [
    ConfigModule,
    SqsModule.registerAsync({
      useFactory: () => {
        const configService = new ConfigService();
        return {
          producers: [
            {
              name: configService.get('QUEUE_NAME'),
              queueUrl: configService.get('QUEUE_URL'),
              region: configService.get('AWS_REGION'),
            },
          ],
          consumers: [],
        };
      },
    }),
  ],
  controllers: [],
  providers: [ConfigService, ProducerService],
})
export class ProducerModule {
  constructor(private configService: ConfigService) {}
  onModuleInit() {
    const myConfig = new AWS.Config();
    myConfig.update({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }
}
