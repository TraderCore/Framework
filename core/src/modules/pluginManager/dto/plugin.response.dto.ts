import { DynamicModule } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import type { PluginInternal } from '../types/plugin.js';

export class PluginResponseDto implements PluginInternal {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    version!: string;

    @ApiProperty()
    location!: string;

    @ApiProperty()
    module!: unknown;
}
