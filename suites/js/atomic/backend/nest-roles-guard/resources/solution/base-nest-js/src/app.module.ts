import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminController } from "./admin/admin.controller";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  controllers: [AppController, AdminController],
  providers: [AppService, RolesGuard, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
