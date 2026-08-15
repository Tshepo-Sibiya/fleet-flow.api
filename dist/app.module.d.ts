import { OnModuleInit } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
export declare class AppModule implements OnModuleInit {
    private readonly seedService;
    constructor(seedService: SeedService);
    onModuleInit(): Promise<void>;
}
