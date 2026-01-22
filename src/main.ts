// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:3002',
//     credentials: true,
//   });

//   await app.listen(process.env.PORT || 3001);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Needed for Stripe webhook
  app.use(
    '/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.enableCors({
  origin: [
    'http://localhost:3002', // local frontend
    'https://stripe-googlepay-front-zeta.vercel.app', // production frontend (Vercel)
  ],
  credentials: true,
});


//  await app.listen(process.env.PORT || 3001);

const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');}
bootstrap();
