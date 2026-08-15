"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seed_module_1 = require("./seed.module");
const seed_service_1 = require("./seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(seed_module_1.SeedModule);
    const seedService = app.get(seed_service_1.SeedService);
    try {
        await seedService.seed();
    }
    catch (error) {
        console.error('Seeding failed:', error);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
bootstrap();
//# sourceMappingURL=run-seed.js.map