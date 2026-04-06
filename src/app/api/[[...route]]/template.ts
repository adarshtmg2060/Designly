import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { templatesInsertSchema, templates } from "@/db/schema";
import { db } from "@/db/drizzle";
import {desc } from "drizzle-orm";

const app = new Hono()
    .get(
        "/",
        verifyAuth(),
         
        async (c) => {
        const auth = c.get("authUser");
        
        if (!auth.token?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const data = await db
            .select()
            .from(templates)
            
            .orderBy(desc(templates.updatedAt));

        return c.json({
            data,
        });
        },
    )
  .post(
    "/",
    verifyAuth(),
    zValidator(
      "json",
      templatesInsertSchema.pick({
        name: true,
        image: true,
        json: true,
      }),
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { name, json, image } = c.req.valid("json");
      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .insert(templates)
        .values({
          name,
          json,
          image,
          userId: auth.token.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!data[0]) {
        return c.json({ error: "Something went wrong" }, 400);
      }

      return c.json({ data: data[0] });
    },
  );

export default app;
