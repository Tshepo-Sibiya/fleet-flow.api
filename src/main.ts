import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Configure Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FleetFlow API')
    .setDescription(
      'API documentation for FleetFlow - Uber Fleet Management, Monies Owed, Weekly Check-Ins, Resend Email Verification, Cash Advances & Early Cashouts.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication, Owner Registration & Email Confirmation')
    .addTag('Vehicles', 'Fleet Vehicle Management & Mileage Service Alerts')
    .addTag('Drivers', 'Driver Onboarding & Resend Email Invitations')
    .addTag('Check-In Rates', 'Weekly Fixed Owner Check-In Fee & Week Lock Rules')
    .addTag('Advances', 'Mid-Week Cash Advances & Early Cashout Requests')
    .addTag('Settlements', 'Weekly Payout Calculations, Partial Debt Carryover & Financial Summaries')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'FleetFlow API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 FleetFlow API is running on http://localhost:${port}/api`);
  console.log(`📚 Swagger Documentation is live on http://localhost:${port}/docs`);
}
bootstrap();
