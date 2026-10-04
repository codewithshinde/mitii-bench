import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const port = Number(process.env.PORT || 0);
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`listening on ${url}`);
}

bootstrap();
