import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Environment } from '../types/environment.enum.js';

export class CoreConfigDto {
    @IsEnum(Environment)
    environment!: Environment;

    @IsBoolean()
    @Type(() => Boolean)
    debug!: boolean;

    @IsNumber()
    @Type(() => Number)
    port!: number;
}
