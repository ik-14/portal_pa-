import React from "react";
import { Experience } from "./components/Experience";
import { Canvas } from "@react-three/fiber";
import UploadImage from "./components/UploadImage";

function App() {
  return (
    <>
      <UploadImage />
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
