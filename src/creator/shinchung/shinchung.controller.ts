import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { CreatorShinchungService } from './shinchung.service';
import { JwtAuthGuard } from '../../auth/jwt-auth';
import { CreatorShinChungDto } from '../creator_dto/shinchung.dto';
import { Shinchunghada } from '@prisma/client';
import { UploadsService } from '../../file-s3/uploads/uploads.service';

@Controller('creator')
export class CreatorShinchungController {
    constructor(private readonly shinchungService: CreatorShinchungService){}

    @UseGuards(JwtAuthGuard) // 토큰 있는지, 썩었는지확인하는 가드
    @Post('/shinchung')
    async creatorShinchung(@Body() shinChungData: CreatorShinChungDto): Promise<any>{
        // 앞단에서 이미지는 따로 등록하도록해서 AWS 주소로 return받은 값 넘겨주기
        return await this.shinchungService.shinchungFund(shinChungData);
    }
}

