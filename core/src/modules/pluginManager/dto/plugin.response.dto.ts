import { ApiProperty } from '@nestjs/swagger';
import { PluginEntrypoint, PluginInternal } from '../types/plugin.js';

export class PluginResponseDto implements PluginInternal {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    version!: string;

    @ApiProperty()
    location!: string;

    @ApiProperty()
    entrypoints!: PluginEntrypoint[];
}
