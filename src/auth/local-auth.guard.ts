import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){

    async canActive(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        return await this.validateRequest(request);
    }

    private async validateRequest(request: any): Promise<boolean> {

        return true;        
    }
}
