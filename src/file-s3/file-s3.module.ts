import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { DownloadModule } from './download/download.module';
import { RedisCacheModule } from '../cache/cache.module';

@Module({
    imports: [UploadsModule, DownloadModule,RedisCacheModule],
})
export class FileS3Module {}
