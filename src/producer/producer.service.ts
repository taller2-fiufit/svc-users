import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { CreateMetricDto } from '../users/dtos/create-metric.dto';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();
const queueName = configService.get<string>('QUEUE_NAME');

@Injectable()
export class ProducerService {
  constructor(private sqsService: SqsService) {}

  async dispatchMetric(metricDto: CreateMetricDto) {
    console.log("HASTA ACA LLEGO", metricDto)
    await this.sqsService.send(queueName, {
      id: 'id',
      body: metricDto,
    });
  }
}
