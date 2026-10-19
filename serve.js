const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dataDir = path.join(root, "data");
const ordersFile = path.join(dataDir, "orders.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]", "utf8");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1000000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function routeApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/orders") {
    return sendJson(res, 200, { ok: true, orders: readOrders() });
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    return parseBody(req)
      .then((payload) => {
        const orders = readOrders();
        const order = {
          id: `VESTO-${Date.now()}`,
          invoiceId: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${orders.length + 1}`,
          status: "Pending",
          createdAt: new Date().toISOString(),
          ...payload
        };
        orders.unshift(order);
        writeOrders(orders);
        sendJson(res, 201, { ok: true, order });
      })
      .catch((err) => sendJson(res, 400, { ok: false, error: err.message }));
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/orders/")) {
    return parseBody(req)
      .then((payload) => {
        const id = pathname.split("/").pop();
        const orders = readOrders();
        const idx = orders.findIndex((o) => o.id === id);
        if (idx === -1) return sendJson(res, 404, { ok: false, error: "Order not found" });
        orders[idx].status = payload.status || orders[idx].status;
        orders[idx].updatedAt = new Date().toISOString();
        writeOrders(orders);
        sendJson(res, 200, { ok: true, order: orders[idx] });
      })
      .catch((err) => sendJson(res, 400, { ok: false, error: err.message }));
  }

  return false;
}

http.createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  if (pathname.startsWith("/api/")) {
    const handled = routeApi(req, res, pathname);
    if (handled !== false) return;
  }

  const safeUrl = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(root, safeUrl);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
    res.writeHead(200);
    res.end(data);
  });
}).listen(5500, "127.0.0.1", () => {
  console.log("VESTO server running on http://127.0.0.1:5500");
});