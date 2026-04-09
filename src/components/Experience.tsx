import {
  CameraControls,
  Environment,
  Preload,
  Text,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Portal } from "./Portal";
import type { PanoramaImage } from "../types";

// Re-export the ACTION enum for configuring CameraControls inputs
import { CameraControls as CameraControlsImpl } from "@react-three/drei";

interface ExperienceProps {
  images: PanoramaImage[];
}

/**
 * Staggered gallery wall layout, centered on the origin.
 * Odd columns offset upward for a museum-wall feel.
 */
function getGalleryPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const colWidth = 3.8;
  const rowHeight = 5.2;
  const cols = Math.min(count, 5);
  const rows = Math.ceil(count / cols);
  const totalWidth = (cols - 1) * colWidth;
  const totalHeight = (rows - 1) * rowHeight;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * colWidth - totalWidth / 2;
    const yOffset = col % 2 === 1 ? 0.6 : 0;
    const y = -(row * rowHeight) + totalHeight / 2 + yOffset;
    const z = Math.sin(i * 1.3) * 0.3;
    positions.push([x, y, z]);
  }
  return positions;
}

export const Experience = ({ images }: ExperienceProps) => {
  const [active, setActive] = useState<string | null>(null);
  const controlsRef = useRef<CameraControls>(null);
  const scene = useThree((state) => state.scene);

  const positions = getGalleryPositions(images.length);

  // When entering/exiting a portal, reconfigure the camera
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (active) {
      // Find the portal and move camera just in front of it
      const obj = scene.getObjectByName(active);
      if (!obj) return;
      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);

      controls.setLookAt(
        worldPos.x, worldPos.y, worldPos.z + 3,
        worldPos.x, worldPos.y, worldPos.z,
        true
      );

      // Inside portal: enable rotate + dolly (zoom), disable truck (pan)
      controls.truckSpeed = 0;
      controls.dollySpeed = 1;
      controls.minDistance = 0.5;
      controls.maxDistance = 5;
    } else {
      // Gallery mode: reset to overview
      controls.setLookAt(0, 0, 14, 0, 0, 0, true);

      // Gallery: enable truck (pan) + dolly (zoom), disable rotate
      controls.truckSpeed = 2;
      controls.dollySpeed = 1;
      controls.minDistance = 4;
      controls.maxDistance = 30;
    }
  }, [active, scene]);

  // ESC to exit portal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />

      <CameraControls
        ref={controlsRef}
        makeDefault
        // Gallery default: pan + zoom, no rotate
        mouseButtons={{
          left: active ? 1 : 2,   // ROTATE when active, TRUCK when gallery
          right: 0,               // NONE
          middle: 0,              // NONE
          wheel: 8,               // DOLLY
        }}
        touches={{
          one: active ? 32 : 64,  // TOUCH_ROTATE when active, TOUCH_TRUCK when gallery
          two: 256,               // TOUCH_DOLLY_TRUCK
          three: 0,               // NONE
        }}
      />

      {images.length === 0 && (
        <Text color="#666" position={[0, 0, 0]} fontSize={0.4}>
          Loading panoramas...
        </Text>
      )}

      {images.map((image, index) => (
        <Suspense key={image.name} fallback={null}>
          <Portal
            name={image.name}
            texture={image.url}
            position={positions[index]}
            rotation={[0, 0, 0]}
            active={active}
            setActive={setActive}
          />
        </Suspense>
      ))}

      {/* Precompile all materials/geometries to avoid jank on first render */}
      <Preload all />
    </>
  );
};
