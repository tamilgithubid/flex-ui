"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface ARCardProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Card position in 3D space [x, y, z] */
  position?: [number, number, number];
  /** Card rotation [x, y, z] in radians */
  rotation?: [number, number, number];
  /** Card width (default: 2) */
  width?: number;
  /** Card height (default: 1.2) */
  height?: number;
  /** Card depth (default: 0.05) */
  depth?: number;
  /** Accent color (default: "#A78BFA") */
  accentColor?: string;
  /** Enable floating animation (default: true) */
  floating?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * AR Card
 *
 * 3D card component designed for spatial interfaces and AR experiences.
 * Features glass-morphic design, floating animation, and interactive
 * hover states with emissive glow. Place inside XRScene.
 */
export function ARCard({
  title,
  description,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2,
  height = 1.2,
  depth = 0.05,
  accentColor = "#A78BFA",
  floating = true,
  onClick,
}: ARCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.005);

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (material.emissiveIntensity !== undefined) {
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        hovered ? 0.3 : 0.05,
        0.1
      );
    }
  });

  const content = (
    <group position={position} rotation={rotation}>
      {/* Card body — glass morphic */}
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={0.06}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshPhysicalMaterial
          color="#111115"
          metalness={0.1}
          roughness={0.2}
          transmission={0.4}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.85}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={0.05}
        />
      </RoundedBox>

      {/* Accent border glow */}
      <RoundedBox
        args={[width + 0.02, height + 0.02, depth * 0.5]}
        radius={0.07}
        smoothness={4}
        position={[0, 0, -depth * 0.3]}
      >
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.15 : 0.05}
        />
      </RoundedBox>

      {/* Title text — uses default drei font (no custom font file needed) */}
      <Text
        position={[0, description ? 0.2 : 0, depth * 0.6]}
        fontSize={0.15}
        maxWidth={width * 0.85}
        textAlign="center"
        color="#fafafa"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Description text */}
      {description && (
        <Text
          position={[0, -0.15, depth * 0.6]}
          fontSize={0.08}
          maxWidth={width * 0.8}
          textAlign="center"
          color="#a1a1aa"
          anchorX="center"
          anchorY="middle"
        >
          {description}
        </Text>
      )}

      {/* Accent line at bottom */}
      <mesh position={[0, -height / 2 + 0.04, depth * 0.6]}>
        <planeGeometry args={[width * 0.6, 0.003]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
    </group>
  );

  if (floating) {
    return (
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        {content}
      </Float>
    );
  }

  return content;
}
