import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import { UploadImage } from "./components/UploadImage";
import { Loader } from "./components/Loader";
import { HUD } from "./components/HUD";
import { useSessionId } from "./hooks/useSessionId";
import type { PanoramaImage } from "./types";

function App() {
  const sessionId = useSessionId();
  const [images, setImages] = useState<PanoramaImage[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/images?sessionId=${sessionId}`);
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      setImages(data.images);
    } catch {
      setImages([
        "battersea1.jpg",
        "battersea2.jpg",
        "panorama.jpg",
        "sevensis1.jpg",
        "sevensis2.jpg",
        "sevensis3.jpg",
        "sevensis4.jpg",
        "shard1.jpg",
        "shard2.jpg",
      ].map((name) => ({ name, url: `/textures/${name}` })));
    }
  }, [sessionId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      {!active && (
        <UploadImage sessionId={sessionId} onUploadComplete={fetchImages} />
      )}
      <Loader />
      <HUD active={!!active} />
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Experience
            images={images}
            active={active}
            setActive={setActive}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
