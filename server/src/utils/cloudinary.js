import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadVideoToCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            folder: "annotator_videos",
            eager: [
                {
                    format: "mp4", // Ensure the video is in MP4 format
                    audio_codec: "aac", // Preserve the audio track
                    video_codec: "auto", // Use the default video codec
                },
            ],
        });
        return response.secure_url;
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error.message);
        return null;
    }
};

export { cloudinary, uploadVideoToCloudinary };