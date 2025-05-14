import Video from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadVideoToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ytdlp = require("youtube-dl-exec");

export const videoUpload = asyncHandler(async (req, res) => {
    let tempFilePath; // Define tempFilePath at the top for proper scope

    try {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            throw new ApiError(400, "Please provide a valid YouTube video URL");
        }

        // Fetch video metadata
        let videoInfo;
        try {
            videoInfo = await ytdlp(videoUrl, {
                dumpSingleJson: true,
                noWarnings: true,
                noCheckCertificate: true,
                format: "bestvideo",
            });
        } catch (error) {
            console.error("Error fetching video info:", error);
            throw new ApiError(400, "Failed to fetch video information. Please check the URL.");
        }

        const videoTitle = videoInfo.title;
        const videoDescription = videoInfo.description || "No description available";
        const videoDuration = videoInfo.duration;

        // Sanitize title and create temp file path
        const sanitizedTitle = videoTitle.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
        const tempDir = path.resolve("temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        tempFilePath = path.resolve(tempDir, `${sanitizedTitle}-${Date.now()}.mp4`);

        // Download video
        try {
            await ytdlp(videoUrl, {
                output: tempFilePath,
                format: "bestvideo",
            });
        } catch (error) {
            console.error("Error downloading video:", error);
            throw new ApiError(500, "Failed to download video from YouTube.");
        }

        // Upload video to Cloudinary
        const cloudinaryUrl = await uploadVideoToCloudinary(tempFilePath);
        if (!cloudinaryUrl) {
            throw new ApiError(500, "Failed to upload video to Cloudinary");
        }

        // Save video details to the database
        let video;
        try {
            video = await Video.create({
                title: videoTitle,
                description: videoDescription,
                duration: videoDuration,
                url: cloudinaryUrl,
            });
            console.log("✅ Video saved to database:", video);
        } catch (error) {
            console.error("❌ Failed to save video to database:", error);
            throw new ApiError(500, "Failed to save video to database");
        }

        // Clean up temporary file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        return res.status(201).json(new ApiResponse(201, video, "Video uploaded successfully"));
    } catch (error) {
        console.error("Error uploading video:", error.stack || error);

        // Ensure temp file cleanup in case of errors
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        throw new ApiError(500, "Internal Server Error. Check console logs!");
    }
});

export const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id);

        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
    } catch (error) {
        console.error("Error fetching video:", error.stack || error);
        throw new ApiError(500, "Internal Server Error. Check console logs!");
    }
});