import { Module } from '@nestjs/common';
import { OpenfundingController } from './openfunding.controller';
import { OpenfundingService } from './openfunding.service';
import { PrismaService } from '../../prisma.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AuthModule } from '../../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/jwt-auth';


@Module({
    imports: [HttpModule, AuthModule
    ],
    controllers: [OpenfundingController],
    providers: [OpenfundingService, PrismaService,
    ]

})
export class OpenfundingModule {}
