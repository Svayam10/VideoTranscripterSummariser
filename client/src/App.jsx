import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import VideoPlayer from "./Components/VideoPlayer.jsx";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/video/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  )
}

export default App
