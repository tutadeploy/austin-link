import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

export const getForwardUrl = () =>
  process.env.FORWARD_URL ||
  `http://${process.env.HOST || "localhost"}:${process.env.FORWARD_PORT}/link-from`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT");

  if (!port) {
    throw new Error("PORT environment variable is not defined");
  }

  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
