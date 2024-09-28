import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Experience = ({textures}) => {

  const [active, setActive] = useState(null);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const target = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(target);
      controlsRef.current.setLookAt(
        0,
        0,
        6,
        target.x,
        target.y,
        target.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 30, 0, 0, 0, true);
    }
  }, [active]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActive(null); // Reset active portal
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Cleanup
    };
  }, []);

  const portalCount = textures.length;
  const spacing = 4.5; // Space between portals
  const startX = -((portalCount - 1) * spacing) / 2; // Calculate starting position

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 1.75}
        minPolarAngle={Math.PI / 3.5}
      />
      <Text color="black" position={[0, 4, 0]} fontSize={0.7}>
        Double click any portal to go into the picture and ESC to go back out
      </Text>
      {textures.map((texture, index) => (
        <Portal
          key={index}
          name={texture}
          texture={texture} // Use the data URL directly
          position-x={startX + index * spacing}
          active={active}
          setActive={setActive}
        />
      ))}
    </>
  );
};

const Portal = ({
  color = "white",
  name,
  texture,
  active,
  setActive,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMat = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMat.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text fontSize={0.3} position={[0, -1.7, 0.076]}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[3, 4.5, 0.15]}
        onDoubleClick={() => {
          setActive(active === name ? null : name);
        }}
      >
        <MeshPortalMaterial ref={portalMat} side={THREE.DoubleSide}>
          <mesh>
            <ambientLight intensity={0.6} />
            <Environment preset="sunset" />
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
