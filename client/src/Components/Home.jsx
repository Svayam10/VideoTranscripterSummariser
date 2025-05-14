import React, { useState } from "react";
import { Youtube, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!youtubeLink.trim() || !youtubeLink.includes("youtube.com")) {
      alert("Please enter a valid YouTube link");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: youtubeLink }), // Use 'videoUrl' to match the backend
      });

      const data = await res.json();

      if (res.ok) {
        const videoId = data.data._id;
        navigate(`/video/${videoId}`);
      } else {
        alert(data.message || "Failed to upload video");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong while processing the video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-2xl border border-indigo-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">YouTube Video Processor</h2>
          <p className="text-slate-500 mt-2">Paste a YouTube link below to get started</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Youtube className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full bg-gray-100 border border-indigo-200 p-4 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            isProcessing
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isProcessing ? "Processing..." : (
            <span className="flex justify-center items-center">
              <Zap className="w-5 h-5 mr-2" />
              Process Video
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;