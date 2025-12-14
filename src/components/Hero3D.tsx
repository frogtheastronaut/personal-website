"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, ContactShadows, Environment, Torus, Sphere, Box, Cone, Icosahedron } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Geometries() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // Adjust threshold as needed

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const scale = isMobile ? 0.6 : 1;

  return (
    <group ref={groupRef} scale={scale}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Torus position={[2, 2, 0]} args={[0.8, 0.2, 16, 32]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial color="#FF6B6B" roughness={0.2} metalness={0.5} />
        </Torus>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Box position={[-2, 1, -1]} args={[1.2, 1.2, 1.2]} rotation={[0, 0.5, 0]}>
          <meshStandardMaterial color="#4ECDC4" roughness={0.2} metalness={0.5} />
        </Box>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
        <Cone position={[0, -2, 1]} args={[1, 2, 32]} rotation={[2, 0, 0]}>
          <meshStandardMaterial color="#FFE66D" roughness={0.2} metalness={0.1} />
        </Cone>
      </Float>

      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.8}>
        <Icosahedron position={[-2.5, -2, -2]} args={[0.8]} rotation={[0, 0, 0.5]}>
          <meshStandardMaterial color="#FF9F1C" roughness={0.2} metalness={0.5} />
        </Icosahedron>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <Sphere position={[2.5, -1, -2]} args={[0.6, 32, 32]}>
          <meshStandardMaterial color="#9B5DE5" roughness={0.2} metalness={0.5} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 h-screen w-full overflow-hidden bg-[#111]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Geometries />
        
        <ContactShadows 
          position={[0, -4, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
