import { Logger, Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';
import { CoreModule } from '@tradercore/core';
import { PluginManagerModule } from '@tradercore/plugin-manager';
import { LoggerModule } from 'nestjs-pino';
import { DevModule } from './dev/dev.module.js';
@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                genReqId: (req) => createId(),

                name: 'TraderCore API',
                level: 'debug',
                transport: {
                    target: 'pino-pretty',
                },
            },
        }),

        CoreModule,
        DevModule,

        PluginManagerModule.forRoot({
            registry: ['https://registry.tradercore.dev'],
        }),
    ],
})
export class AppModule {}
