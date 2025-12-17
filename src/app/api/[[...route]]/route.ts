import { Hono } from "hono";
import { handle } from "hono/vercel";

import images from "./images";

// revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.route("/images", images);

// ✅ Export the app type AFTER routes are attached
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
