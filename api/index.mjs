import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto-register all .mjs files in /api except index.mjs
const apiDir = __dirname;
fs.readdirSync(apiDir).forEach(file => {
  if (file.endsWith(".mjs") && file !== "index.mjs") {
    const route = "/api/" + file.replace(".mjs", "");
    const modulePath = path.join(apiDir, file);
    const fileUrl = pathToFileURL(modulePath).href;   // ✅ convert to file:// URL
    import(fileUrl).then(module => {
      app.all(route, (req, res) => module.default(req, res));
      console.log(`Mounted ${route}`);
    }).catch(err => console.error(`Failed to load ${file}:`, err));
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
