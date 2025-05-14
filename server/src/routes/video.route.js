import express from 'express';
import { videoUpload ,getVideoById} from '../controllers/video.controller.js';

const router = express.Router();

router.post("/upload", videoUpload);
router.get("/videos/:id", getVideoById); 

export default router;