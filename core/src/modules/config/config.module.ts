import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CoreConfig } from './configs/core/core.config.js';
import { CoreConfigService } from './configs/core/core.service.js';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [CoreConfig],
        }),
    ],
    providers: [CoreConfigService],
    exports: [CoreConfigService],
})
export class ConfigModule {}
