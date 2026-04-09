import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import { UploadImage } from "./components/UploadImage";
import { useSessionId } from "./hooks/useSessionId";
import type { PanoramaImage } from "./types";

function App() {
  const sessionId = useSessionId();
  const [images, setImages] = useState<PanoramaImage[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/images?sessionId=${sessionId}`);
      const data = await res.json();
      setImages(data.images);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      <UploadImage sessionId={sessionId} onUploadComplete={fetchImages} />
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Experience images={images} />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
