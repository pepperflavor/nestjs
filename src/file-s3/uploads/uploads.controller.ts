import { Body, Controller, Post, UploadedFile, UseInterceptors, Get, Req } from "@nestjs/common";
import { Param, UploadedFiles } from "@nestjs/common/decorators";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Expr } from "aws-sdk/clients/cloudsearchdomain";
import { UploadsService } from "./uploads.service";

@Controller("uploadS3")
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  // 앞단에서 이미지는 따로 등록하도록한다음 url리턴하는거 받아오자
  // 업로드 완성
  @Post("/image")
  // @UseInterceptors(FileFieldsInterceptor([{ name: "uploadedImg" }])) // (FileInterceptor('') - '' 을 앞단에서 보내주는 파일 키값이랑 같게 써줘야함
  @UseInterceptors(FileInterceptor("uploadedImg"))
  async postS3Image(@UploadedFile() file: Express.MulterS3.File) {
    // 주의 : Express.Multer.File 랑 다른객체
    const url = await this.uploadService.s3Uploadimage(file); // 파일이름 이상하게 저장됨

    return url;
  }

}