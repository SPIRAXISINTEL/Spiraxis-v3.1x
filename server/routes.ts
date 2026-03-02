import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.dummy.ping.path, async (req, res) => {
    res.json({ message: "pong" });
  });

  return httpServer;
}
