import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { JwtAuthGuard } from '../../auth/jwt-auth';

@Controller('admin')
export class MypageController {
    constructor(private readonly mypageService: MypageService){}

    // admin은 미리 넣어놓기
    //@UseGuards(JwtAuthGuard)
    @Get('/mypage')
    async adminFundingList(){
        console.log("admin 마이페이지 요청들어왔다"); 
        return await this.mypageService.getAllFundList();
    }
    
    //@UseGuards(JwtAuthGuard)
    @Post('/mypage/permit/:id')
    async adminPermit(@Param('id') fundingID: string){
        const adminSelectID = parseInt(fundingID);
        return await this.mypageService.updatePermit(adminSelectID);
    }

    //@UseGuards(JwtAuthGuard)
    @Post('/mypage/reject/:id')
    async adminReject(@Param('id') fundingID: string){
        const adminSelectID = parseInt(fundingID);
        return await this.mypageService.updateReject(adminSelectID);
    }

    //@UseGuards(JwtAuthGuard)
    @Get('/mypage/:id')
    async getOneFunding(@Param('id') fundingID: string){
        const adminSelectID = parseInt(fundingID);
        return await this.mypageService.getOneFundData(adminSelectID);
    }
}
