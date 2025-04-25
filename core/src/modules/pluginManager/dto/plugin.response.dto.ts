import { DynamicModule } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    PluginEntrypoint,
    PluginInternal,
    PluginType,
} from '../types/plugin.js';

export class PluginResponseDto implements PluginInternal {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    version!: string;

    @ApiProperty()
    location!: string;

    @ApiProperty({ type: () => [PluginEntrypointResponseDto] })
    entrypoints!: PluginEntrypoint[];
}

class PluginEntrypointResponseDto implements PluginEntrypoint {
    @ApiProperty({ enum: PluginType })
    type!: PluginType;

    @ApiProperty()
    description!: string;

    module!: DynamicModule;
}
