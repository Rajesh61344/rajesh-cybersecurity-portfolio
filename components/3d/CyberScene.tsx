
"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";

function CyberCore() {
  const group = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.22;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.08;

    if (outerRing.current) {
      outerRing.current.rotation.x += delta * 0.45;
      outerRing.current.rotation.z -= delta * 0.25;
    }

    if (innerRing.current) {
      innerRing.current.rotation.y -= delta * 0.65;
      innerRing.current.rotation.x += delta * 0.18;
    }
  });

  return (
    <group ref={group}>
      {/* CORE */}

      <mesh>
        <icosahedronGeometry args={[1.15, 4]} />

        <meshStandardMaterial
          color="#071519"
          emissive="#062f38"
          emissiveIntensity={1.8}
          metalness={0.8}
          roughness={0.25}
          wireframe
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* INNER CORE */}

      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.15, 3]} />

        <meshStandardMaterial
          color="#071519"
          emissive="#00d9ff"
          emissiveIntensity={1.7}
          metalness={0.9}
          roughness={0.18}
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* CENTER LIGHT */}

      <mesh scale={0.28}>
        <sphereGeometry args={[1, 32, 32]} />

        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* OUTER RING */}

      <mesh
        ref={outerRing}
        rotation={[Math.PI / 2.3, 0, 0]}
      >
        <torusGeometry args={[1.65, 0.012, 8, 160]} />

        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* SECOND RING */}

      <mesh
        ref={innerRing}
        rotation={[Math.PI / 3, Math.PI / 5, 0]}
      >
        <torusGeometry args={[1.4, 0.008, 8, 140]} />

        <meshBasicMaterial
          color="#0891b2"
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* ORBIT NODES */}

      <OrbitNode
        position={[1.55, 0.2, 0]}
        speed={1.1}
      />

      <OrbitNode
        position={[-1.45, -0.3, 0.2]}
        speed={0.8}
      />

      <OrbitNode
        position={[0.25, 1.5, 0.15]}
        speed={1.4}
      />

      <OrbitNode
        position={[-0.35, -1.45, -0.1]}
        speed={1}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* ORBIT NODE                                                                  */
/* -------------------------------------------------------------------------- */

function OrbitNode({
  position,
  speed,
}: {
  position: [number, number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.elapsedTime * speed;

    ref.current.position.y =
      position[1] + Math.sin(time) * 0.08;

    ref.current.position.x =
      position[0] + Math.cos(time * 0.7) * 0.04;

    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.015;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.08, 0.08, 0.08]} />

      <meshBasicMaterial
        color="#67e8f9"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* FLOATING DATA NODES                                                        */
/* -------------------------------------------------------------------------- */

function FloatingNodes() {
  const nodes = useMemo(
    () => [
      [-2.1, 1.3, -0.5],
      [2.2, 1.1, -0.7],
      [-2.3, -1.2, -0.4],
      [2.1, -1.4, -0.8],
      [0.3, 2.1, -1],
      [-0.5, -2, -0.9],
      [1.3, 0.4, -1.2],
      [-1.4, 0.2, -1],
    ],
    []
  );

  return (
    <group>
      {nodes.map((position, index) => (
        <Float
          key={index}
          speed={0.8 + index * 0.04}
          rotationIntensity={0.5}
          floatIntensity={0.45}
        >
          <mesh position={position as [number, number, number]}>
            <sphereGeometry args={[0.025, 12, 12]} />

            <meshBasicMaterial
              color="#22d3ee"
              transparent
              opacity={0.55}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* MOUSE CAMERA                                                                */
/* -------------------------------------------------------------------------- */

function MouseCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const targetX = state.pointer.x * 0.22;
    const targetY = state.pointer.y * 0.14;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      0.025
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY,
      0.025
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/* SCENE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CyberScene() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 5]}
          fov={45}
        />

        <ambientLight intensity={0.18} />

        <pointLight
          position={[2, 2, 3]}
          intensity={5}
          color="#22d3ee"
          distance={7}
        />

        <pointLight
          position={[-3, -2, 2]}
          intensity={2}
          color="#0e7490"
          distance={6}
        />

        <CyberCore />

        <FloatingNodes />

        <Sparkles
          count={100}
          scale={[5, 4, 4]}
          size={1.2}
          speed={0.25}
          color="#67e8f9"
        />

        <MouseCamera />

        <fog
          attach="fog"
          args={["#020607", 4, 8]}
        />
      </Canvas>
    </div>
  );
}
