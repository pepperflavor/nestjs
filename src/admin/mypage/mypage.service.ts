import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HttpService } from '@nestjs/axios';
import { EmailService } from '../../email/email.service';
import { NFTStorage, File, Blob } from 'nft.storage';
import mime from 'mime';
import axios from 'axios';


@Injectable()
export class MypageService {
    constructor(private prisma: PrismaService, private readonly http: HttpService, private emailService: EmailService){}

    client = new NFTStorage({
        token: process.env.NFT_Storage,
      });
    // 상태값이 1인 심사대기중인 목록만 뽑아옴
    // 잘된다!
    async getAllFundList(){
        const result = await this.prisma.shinchunghada.findMany({ // 관계형 테이블을 사용해서 fundMany() 사용
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

    // admin이 승인 OK 해줬을때 해줌
    // 이메일발송 추가하기
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

    
        
        // 이미지 주소 ipfs일 필요가 없다고 한다^^
        const [temp] = fundingData; // 결과값이 배열이라 구조분해 할당으로 객체로 바꿔줌
        // 모르면 노가다... 일단 정보들 다 뽑아옴
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
                    description : shin_cover
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
        // 메타데이터 업로드 하고 주소 받아옴
        const metadataURL = await this.uploadIPFS(obj);

        // metadataURL; // 이 주소 db에 저장하기
        // admin이 permit 하면 funding 테이블에도 저장하면서
        // 메타데이터 url도 저장해주기
        // upsert 특정값이 a라면 지정한 값도 변경해준다
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


        const wallet = result.shin_creator_address // 크리에이터의 지갑주소

        const title = result.shin_title;

        // 지갑주소로 이메일 찾기
        const temptwo = await this.prisma.user.findFirst({
            where: {
                user_wallet: wallet
            },
            select:{
                user_email: true,
            }
        })


        
        const email = temptwo.user_email;

        
        // 메일로 알려주기
        await this.emailService.sendCreatorJoinVerification(email, title, 'permit')

        if(result){
        // 여기서 funding 테이블에도 저장함
            return result;
        }else{
            throw new HttpException('승인처리 실패', 404);
        }
    }


    // admin이 승인거절 했을때 실행할 함수
    // 여기서 s3에 저장한 이미지 삭제하기
    async updateReject(fundingID: number){
        
        const result = await this.prisma.shinchunghada.update({
            where:{
                shin_no : fundingID,
            },
            data: {
                shin_ispermit : 3,
            }
        })

        const wallet = result.shin_creator_address // 지갑주소

        const title = result.shin_title; // 음악파일 이름 뽑음

        // 지갑주소로 이메일 찾기
        const temp = await this.prisma.user.findUnique({
            where: {
                user_wallet: wallet
            }
        })
        const email = temp.user_email

        
        // 메일로 알려주기
        await this.emailService.sendCreatorJoinVerification(email, title, 'reject');

        const instance = axios.create({
            baseURL : 'http://localhost:3001/deleteS3/'
        })

        const response = await instance.delete(`${title}`);


        if(result){
            return result;
        }else{
            throw new HttpException('승인 반려처리 실패', 404);
        }
    }



    // 메타데이터 피닝하고 주소 받아오는 함수
    private async uploadIPFS(fundingDATA: object){
        // Blob - nft.storage 에서 임포트해야함
        const metadata = new Blob([JSON.stringify(fundingDATA)], {
            type: 'application/json',
        });

        const metadataCid = await this.client.storeBlob(metadata);
        const meatadataUrl = 'https://' + metadataCid + '.ipfs.nftstorage.link';
        return meatadataUrl;
    }


    // 관계형 테이블에서 관계테이블들의 특정 컬럼 값만 뽑아오기 테스트용
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

        const [a] = result; // result 값이 배열로나와서 구조분해 할당으로 객체 형태로 뽑아내기
        const {shin_cover} = a // 객체형태로 뽑아낸 shinData에서 이미지 주소만 뽑아오기
        const { composer} =a

        const [{com_name}] = composer

        
        
        return result;
    }
}
