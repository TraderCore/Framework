import { Controller, Get } from '@nestjs/common';
import { DevService } from './dev.service.js';

@Controller('dev')
export class DevController {
    constructor(private readonly devService: DevService) {}

    @Get()
    health() {
        return { status: 'ok' };
    }

    @Get('test')
    test() {
        return this.devService.test();
    }
}
