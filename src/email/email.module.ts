import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisCacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

@Module({
    imports:[RedisCacheModule],
    providers: [EmailService, CacheService],
    exports: [EmailService],
})
export class EmailModule {}
