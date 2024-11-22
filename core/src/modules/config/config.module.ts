import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CoreConfig, CoreConfigService } from './core.config.js';

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
