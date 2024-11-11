import { Module } from '@nestjs/common';
import { DevController } from './dev.controller.js';
import { DevService } from './dev.service.js';

@Module({
    imports: [],
    controllers: [DevController],
    providers: [DevService],
})
export class DevModule {}
