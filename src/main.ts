import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import connectRedis from 'connect-redis';
import session from 'express-session';
import redis from 'redis';
import { AppModule } from './app.module';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      name: 'sid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      secret: 'super secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
