import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/videos/${id}`);
        const data = await res.json();

        if (res.ok) {
          setVideo(data.data);
        } else {
          console.error("Error fetching video:", data.message);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!video) return <div className="p-6 text-center text-red-500">Video not found</div>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Video Player */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{video.title}</h2>
          <video
            src={video.url} // Use the Cloudinary URL from the backend
            controls
            autoPlay
            muted={false}
            className="w-full rounded-lg"
          />
        </div>

        {/* Video Description */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">📄 Description</h3>
          <p className="text-slate-700">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;