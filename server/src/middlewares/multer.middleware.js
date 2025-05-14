import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp folder exists
const tempDir = path.resolve("temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(/\s/g, "-").split(".")[0];
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video/");
    if (!isVideo) return cb(new Error("Only video files are allowed"));
    cb(null, true);
  },
});

export default upload;
