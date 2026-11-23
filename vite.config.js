import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

// Custom middleware: redirect /admin and /admin/ to /admin/index.html
function adminRedirectPlugin() {
  return {
    name: "admin-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/admin" || req.url === "/admin/") {
          const adminFile = path.resolve(root, "admin/index.html");
          const content = fs.readFileSync(adminFile, "utf-8");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.statusCode = 200;
          res.end(content);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [adminRedirectPlugin()],
  server: {
    fs: { strict: false },
  },
  build: {
    rollupOptions: {
      input: {
        main:     resolve(root, "index.html"),
        catalog:  resolve(root, "catalog.html"),
        about:    resolve(root, "about.html"),
        contacts: resolve(root, "contacts.html"),
        admin:    resolve(root, "admin/index.html"),
      },
    },
  },
});
