import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/hooks/useTheme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import waveVert from "./shaders/wave.vert?raw";
import waveFrag from "./shaders/wave.frag?raw";

const THEME_COLORS: Record<
  string,
  { a: [number, number, number]; b: [number, number, number] }
> = {
  "dark-electric": {
    a: [0.7, 0.2, 0.1],   // hot red
    b: [0.1, 0.08, 0.2],  // deep blue-black
  },
  "raw-textured": {
    a: [0.5, 0.28, 0.12],  // burnt sienna
    b: [0.82, 0.78, 0.68], // warm cream
  },
  hybrid: {
    a: [0.65, 0.4, 0.15],  // warm amber
    b: [0.12, 0.1, 0.08],  // dark brown
  },
};

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color(...THEME_COLORS["dark-electric"].a) },
      uColorB: { value: new THREE.Color(...THEME_COLORS["dark-electric"].b) },
      uOpacity: { value: 0.6 },
    }),
    [],
  );

  useFrame((state) => {
    if (prefersReducedMotion) return;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(pointer.x, pointer.y),
      0.05,
    );

    const colors = THEME_COLORS[theme] || THEME_COLORS["dark-electric"];
    uniforms.uColorA.value.lerp(new THREE.Color(...colors.a), 0.05);
    uniforms.uColorB.value.lerp(new THREE.Color(...colors.b), 0.05);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.35, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[6, 4, 128, 128]} />
      <shaderMaterial
        vertexShader={waveVert}
        fragmentShader={waveFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <WaveMesh />
      </Canvas>
    </div>
  );
}
