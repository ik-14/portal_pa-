import {
  Environment,
  MeshPortalMaterial,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import * as THREE from "three";

interface PortalProps {
  name: string;
  texture: string;
  active: string | null;
  setActive: (name: string | null) => void;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const Portal = ({
  name,
  texture,
  active,
  setActive,
  ...props
}: PortalProps) => {
  const map = useTexture(texture);
  const portalRef = useRef<any>(null);

  useFrame((_state, delta) => {
    if (!portalRef.current) return;
    const isOpen = active === name;
    easing.damp(portalRef.current, "blend", isOpen ? 1 : 0, 0.2, delta);
  });

  const label = name.replace(/\.[^.]+$/, "");

  return (
    <group {...props}>
      <Text fontSize={0.25} position={[0, -1.8, 0.1]} color="#333">
        {label}
      </Text>
      <RoundedBox
        name={name}
        args={[3, 4, 0.15]}
        onDoubleClick={() => setActive(active === name ? null : name)}
      >
        <MeshPortalMaterial
          ref={portalRef}
          side={THREE.DoubleSide}
          resolution={256}
        >
          <ambientLight intensity={0.6} />
          <Environment preset="sunset" />
          <mesh>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
