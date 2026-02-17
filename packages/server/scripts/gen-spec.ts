import { generateSpecs } from 'hono-openapi';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from "../src/index.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const specs = await generateSpecs(app, {
      documentation: {
        info: { 
          title: "Todo Worker Api", 
          version: "1.0.0" 
        },
        servers: [{ url: "/api" }]
      }
    });

    const outputPath = path.resolve(__dirname, "../openapi.json");
    fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
    console.log(" Spec generated successfully!");
  } catch (err) {
    console.error("Generation failed:", err);
    process.exit(1);
  }
}

main();
