import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { upload } from "../middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../../uploads");

export const imagesRouter = Router();

/** Default panoramas bundled with the app */
const DEFAULT_IMAGES = [
  "battersea1.jpg",
  "battersea2.jpg",
  "panorama.jpg",
  "sevensis1.jpg",
  "sevensis2.jpg",
  "sevensis3.jpg",
  "sevensis4.jpg",
  "shard1.jpg",
  "shard2.jpg",
  "Firefly.jpg"
];

/**
 * In-memory map of sessionId -> list of uploaded filenames.
 * Each user only sees their own uploads + the defaults.
 */
const sessionUploads = new Map<string, string[]>();

/** Ensure the uploads directory exists */
function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

/**
 * GET /api/images?sessionId=xxx
 * Returns default images + this session's uploaded images.
 */
imagesRouter.get("/images", (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string | undefined;

  const defaults = DEFAULT_IMAGES.map((name) => ({
    name,
    url: `/textures/${name}`,
  }));

  if (!sessionId || !sessionUploads.has(sessionId)) {
    return res.json({ images: defaults });
  }

  const uploaded = sessionUploads.get(sessionId)!.map((filename) => ({
    name: filename,
    url: `/uploads/${filename}`,
  }));

  return res.json({ images: [...defaults, ...uploaded] });
});

/**
 * POST /api/upload
 * Accepts a single image file + sessionId in the body.
 */
imagesRouter.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    ensureUploadsDir();

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const sessionId = req.body.sessionId as string | undefined;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const filename = req.file.filename;

    // Track this upload under the user's session
    if (!sessionUploads.has(sessionId)) {
      sessionUploads.set(sessionId, []);
    }
    sessionUploads.get(sessionId)!.push(filename);

    return res.json({
      name: filename,
      url: `/uploads/${filename}`,
    });
  }
);
