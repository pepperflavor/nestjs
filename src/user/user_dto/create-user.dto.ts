import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches,IsNumber, IsOptional } from "class-validator"
// userSignUpDto 였음
export class CreateUserDto{

    @Transform(params => params.value.trim()) 
    @IsString()
    @IsEmail()
    user_email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/) 
    user_pwd: string

    @IsString()
    user_wallet: string

    @IsString()
    user_nickname: string

    @IsNumber()
    @IsOptional()
    user_grade?: number
    
    @IsNumber()
    @IsOptional()
    user_streaming?: number

    @IsString()
    @IsOptional()
    user_email_token?: string
}



