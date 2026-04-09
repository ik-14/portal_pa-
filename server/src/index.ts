import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { imagesRouter } from "./routes/images.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

// API routes
app.use("/api", imagesRouter);

// In production, serve the built Vite frontend
if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../../dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
