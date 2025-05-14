import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    summary: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    transcript: {
        type: String
    },
    chunks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TranscriptChunk"
    }],
},{timestamps: true});

const Video = mongoose.model("Video", videoSchema);
export default Video;