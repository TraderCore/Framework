import { ApiProperty } from '@nestjs/swagger';

export class PluginResponseDto {
    @ApiProperty()
    location!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    version!: string;
}
