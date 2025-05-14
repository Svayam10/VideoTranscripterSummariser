import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
    try {
        const response = await cloudinary.uploader.upload("./Screen Recording 2024-07-25 161116.mp4", {
            resource_type: "video",
            folder: "test_videos",
        });
        console.log("✅ Video uploaded successfully:", response.secure_url);
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error.message);
    }
})();