import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';

@Module({
    imports: [],
    providers: [PluginService],
    exports: [PluginService],
})
export class PluginModule {}
