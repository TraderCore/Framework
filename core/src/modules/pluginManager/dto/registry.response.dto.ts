import { ApiProperty } from '@nestjs/swagger';
import { Registry } from '../types/registry.js';

export class RegistryResponseDto implements Registry {
    @ApiProperty()
    url!: string;

    authorization!: string;
}
