import { Module } from '@nestjs/common';
import { ConfigModule } from './config/index.js';

@Module({
    imports: [ConfigModule],
    providers: [],
    exports: [],
})
export class CoreModule {}
