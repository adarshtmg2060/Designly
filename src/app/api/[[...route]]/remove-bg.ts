import { Hono } from "hono";

const app = new Hono().post("/", async (c) => {
  const body = await c.req.json();
  const { imageUrl } = body;

  if (!imageUrl) {
    return c.json({ error: "No image URL provided" }, 400);
  }

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "NXvTBCp5rrQ1EtrrtwBeiPsu",
    },
    body: new URLSearchParams({
      image_url: imageUrl,
      size: "auto",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return c.json({ error: errorText }, 400);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return c.body(buffer, 200, {
    "Content-Type": "image/png",
  });
});

export default app;
