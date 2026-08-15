import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  try {
    await seedService.seed();
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}
bootstrap();
