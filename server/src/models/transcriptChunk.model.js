import mongoose from "mongoose";

const transcriptChunkSchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    text:{
        type: String,
    },
    startTime: {
        type: Number,
        required: true,
    },
    endTime: {
        type: Number,
        required: true,
    },
    embeddings: [{
        type: Number,
    }],
})