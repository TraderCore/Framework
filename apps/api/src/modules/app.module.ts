import { Logger, Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';
import { CoreModule } from '@tradercore/core';
import { CoreConfigService, Environment } from '@tradercore/core/config';
import { LoggerModule } from 'nestjs-pino';
import { DevModule } from './dev/dev.module.js';
@Module({
    imports: [
        LoggerModule.forRootAsync({
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService) => ({
                pinoHttp: {
                    genReqId: (req) => createId(),

                    name: 'TraderCore',
                    level: config.logLevel,
                    transport:
                        config.environment === Environment.Development
                            ? {
                                  target: 'pino-pretty',
                              }
                            : undefined,
                },
            }),
        }),

        CoreModule,
        DevModule,
    ],
})
export class AppModule {}
