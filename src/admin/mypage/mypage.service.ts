import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HttpService } from '@nestjs/axios';
import { EmailService } from '../../email/email.service';
import { NFTStorage, File, Blob } from 'nft.storage';
import axios from 'axios';


@Injectable()
export class MypageService {
    constructor(private prisma: PrismaService, private readonly http: HttpService, private emailService: EmailService){}

    client = new NFTStorage({
        token: process.env.NFT_Storage,
      });

    async getAllFundList(){
        const result = await this.prisma.shinchunghada.findMany({ 
            where: {
                shin_ispermit: 1,
            }
        })
        if(result){
            return result;
        }else{
            throw new Error('목록조회 실패');
        }
    }

    async updatePermit(fundingID: number){
        const result = await this.prisma.shinchunghada.update({
            where:{
                shin_no : fundingID,
            },
            data: {
                shin_ispermit : 2,
            }
        })

           // 신청테이블에서 데이터 값뽑아오기
        const fundingData = await this.prisma.shinchunghada.findMany({
            where: {
                shin_no: fundingID
            },
            include:{
                singer: {
                    select: {
                        sing_name: true,
                    }
                },
                composer: {
                    select:{
                        com_name: true,
                    }
                },
                lyricist: {
                    select: {
                        lyric_name: true,
                    }
                },
            }
        })

        console.log("@@@ fundingData : ",fundingData);
        

        const [temp] = fundingData; 
        const { shin_title } = temp;
        const { shin_cover } = temp; 
        const { shin_description } = temp; 
        const { shin_category } = temp; 

        // 작사가 작곡가 가수
        const {composer} = temp
        const {lyricist} = temp
        const {singer} = temp
        const [{com_name}] = composer
        const [{lyric_name}] = lyricist
        const [{sing_name}] = singer

        // 이미지 url 
        const imgURL = shin_cover;

        // 메타데이터
        const obj = {
            title : shin_title,
            type : "object",
            properties: {
                image:{
                    type: "string",
                    description : shin_description
                },
                category:{
                    type: "string",
                    description: shin_category
                },
                composer:{
                    type: "string",
                    description : com_name
                },
                lyricist:{
                    type: "string",
                    description : lyric_name
                },
                singer:{
                    type: "string",
                    description : sing_name
                }
            }
        }

        const metadataURL = await this.uploadIPFS(obj);

        await this.prisma.funding.upsert({
            where:{
                shin_no: fundingID
            },
            create :{
                shin_no : fundingID,
                fund_pinurl: metadataURL
            },
            update:{
                fund_pinurl : metadataURL
            }
        })


        const wallet = result.shin_creator_address 
        console.log("@@ 뽑아낸 지갑주소 : ",wallet);
        const title = result.shin_title;

        const temptwo = await this.prisma.user.findFirst({
            where: {
                user_wallet: wallet
            }
        })


        const email = temptwo.user_email


        await this.emailService.sendCreatorJoinVerification(email, title, 'permit')

        if(result){
            return result;
        }else{
            throw new HttpException('승인처리 실패', 400);
        }
    }


    async updateReject(fundingID: number){
        if(fundingID)console.log('아이디값 잘받아옴', fundingID);
        
        const result = await this.prisma.shinchunghada.update({
            where:{
                shin_no : fundingID,
            },
            data: {
                shin_ispermit : 3,
            }
        })

        const wallet = result.shin_creator_address 

        const title = result.shin_title; 


        const temp = await this.prisma.user.findUnique({
            where: {
                user_wallet: wallet
            }
        })
        const email = temp.user_email
        console.log("@@@ temp : ", temp) 
        

        await this.emailService.sendCreatorJoinVerification(email, title, 'reject');

        const instance = axios.create({
            baseURL : 'http://localhost:3001/deleteS3/'
        })

        const response = await instance.delete(`${title}`);
        if(response){
            console.log('삭제 성공, mypage')
        }else{
            console.log('삭제 실패, mypage ')
        }

        if(result){
            console.log('승인 반려처리 성공');
            return result;
        }else{
            throw new HttpException('승인 반려처리 실패', 400);
        }
    }




    private async uploadIPFS(fundingDATA: object){
        const metadata = new Blob([JSON.stringify(fundingDATA)], {
            type: 'application/json',
        });

        const metadataCid = await this.client.storeBlob(metadata);
        const meatadataUrl = 'https://' + metadataCid + '.ipfs.nftstorage.link';
        return meatadataUrl;
    }


    async getOneFundData(adminSelectID: number){
        const result = await this.prisma.shinchunghada.findMany({
            where: {
                shin_no: adminSelectID
            },
            include:{
                singer: {
                    select: {
                        sing_name: true,
                    }
                },
                composer: {
                    select:{
                        com_name: true,
                    }
                },
                lyricist: {
                    select: {
                        lyric_name: true,
                    }
                },
            }
        })

        const [a] = result; 
        const {shin_cover} = a 
        const { composer} =a

        const [{com_name}] = composer
  
        return result;
    }
}
