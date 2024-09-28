import React, { useState } from "react";
import { Experience } from "./components/Experience";
import { Canvas } from "@react-three/fiber";
import UploadImage from "./components/UploadImage";

function App() {
  const [textures, setTextures] = useState([]);

  const addTexture = (dataUrl) => {
    setTextures((prevTextures) => [...prevTextures, dataUrl]); // Add the data URL
  };

  return (
    <>
      <UploadImage onUpload={addTexture} />
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 30 }}>
        <Experience textures={textures} />
      </Canvas>
    </>
  );
}

export default App;
