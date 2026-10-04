import http from "node:http";

const started = Date.now();

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: (Date.now() - started) / 1000,
      }),
    );
    return;
  }
  if (req.method === "POST" && url.pathname === "/echo") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      payload = body;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

const port = Number(process.env.PORT || 0);
if (process.env.MITII_NO_LISTEN !== "1") {
  server.listen(port, () => {
    const address = server.address();
    if (address && typeof address === "object") {
      console.log(`listening on ${address.port}`);
    }
  });
}
