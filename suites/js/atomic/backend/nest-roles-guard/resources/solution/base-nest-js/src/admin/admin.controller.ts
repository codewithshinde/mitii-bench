import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("admin")
@UseGuards(RolesGuard)
export class AdminController {
  @Get("stats")
  @Roles("admin")
  stats() {
    return { ok: true };
  }
}
