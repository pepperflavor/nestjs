import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
    constructor(@Inject(forwardRef(() => CACHE_MANAGER)) private readonly cache: Cache){}


    async get(key: string): Promise<any>{
       return await this.cache.get(key);
    }

    // 캐시에 항목을 추가 option: TTL(만료시간을 수동으로 지정할 수 있다.)
    async set(key: string, value: any, option?: any){
        await this.cache.set(key, value, option);
    }


    async reset(){
        await this.cache.reset();
    }


    async delete(key: string){
        await this.cache.del(key);
    }
}
