import { Context, Hono } from "hono";
import { handle } from "hono/vercel";

import images from "./images";
import removebg from "./remove-bg";
import users from "./users";
import projects from "./projects";
import templates from "./template";

import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import authConfig from "@/auth.config";

// revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
  return {
    // need to add env variable
    secret: "PRWj8o9LtG/qmgwrhnW70ZmgVqjAebQtuhJ/2UYnL94=",
    ...(authConfig as any),
  };
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

app.route("/images", images);
app.route("/remove-bg", removebg);
app.route("/users", users);
app.route("/projects", projects);
app.route("/templates",templates);

// ✅ Export the app type AFTER routes are attached
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
