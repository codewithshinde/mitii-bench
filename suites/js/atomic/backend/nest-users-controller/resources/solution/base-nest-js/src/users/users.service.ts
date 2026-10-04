import { Injectable } from "@nestjs/common";

export interface User {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [{ id: 1, email: "demo@example.com" }];
  private nextId = 2;

  findAll(): User[] {
    return this.users;
  }

  create(email: string): User {
    const user = { id: this.nextId++, email };
    this.users.push(user);
    return user;
  }
}
