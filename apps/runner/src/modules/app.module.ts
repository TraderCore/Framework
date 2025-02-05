import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';
import { CoreModule, PluginManagerModule } from '@tradercore/framework';
import { CoreConfigService, Environment } from '@tradercore/framework/config';
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
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CoreModule,
        PluginManagerModule.forRoot({ registry: [] }),
        // DevModule,
    ],
})
export class AppModule {}
