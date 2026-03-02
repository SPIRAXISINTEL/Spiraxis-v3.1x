import { type Dummy } from "@shared/schema";

export interface IStorage {
  getPing(): Promise<string>;
}

export class MemStorage implements IStorage {
  async getPing(): Promise<string> {
    return "pong";
  }
}

export const storage = new MemStorage();
