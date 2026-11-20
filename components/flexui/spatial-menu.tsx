"use client";

import { Float, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface SpatialMenuItem {
  /** Menu item label */
  label: string;
  /** Menu item icon (emoji or short text) */
  icon?: string;
  /** Click handler */
  onClick?: () => void;
  /** Accent color override */
  color?: string;
}

interface SpatialMenuProps {
  /** Menu items */
  items: SpatialMenuItem[];
  /** Menu position in 3D space */
  position?: [number, number, number];
  /** Layout direction (default: "horizontal") */
  layout?: "horizontal" | "vertical" | "radial";
  /** Spacing between items (default: 0.6) */
  spacing?: number;
  /** Item size (default: 0.5) */
  itemSize?: number;
  /** Accent color (default: "#A78BFA") */
  accentColor?: string;
  /** Enable floating animation (default: true) */
  floating?: boolean;
}

/**
 * Spatial Menu
 *
 * 3D menu component for spatial/AR interfaces. Renders menu items
 * as floating pills arranged horizontally, vertically, or in a
 * radial pattern. Each item has hover glow and spring animation.
 *
 * @example
 * ```tsx
 * <XRScene>
 *   <SpatialMenu
 *     items={[
 *       { label: "Components", icon: "📦", onClick: () => {} },
 *       { label: "Themes", icon: "🎨", onClick: () => {} },
 *       { label: "Docs", icon: "📖", onClick: () => {} },
 *     ]}
 *     layout="radial"
 *   />
 * </XRScene>
 * ```
 */
export function SpatialMenu({
  items,
  position = [0, 0, 0],
  layout = "horizontal",
  spacing = 0.6,
  itemSize = 0.5,
  accentColor = "#A78BFA",
  floating = true,
}: SpatialMenuProps) {
  const getItemPosition = (index: number): [number, number, number] => {
    const count = items.length;
    switch (layout) {
      case "horizontal":
        return [(index - (count - 1) / 2) * spacing, 0, 0];
      case "vertical":
        return [0, ((count - 1) / 2 - index) * spacing, 0];
      case "radial": {
        const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
        const radius = spacing * 1.2;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
      }
    }
  };

  const content = (
    <group position={position}>
      {items.map((item, i) => (
        <SpatialMenuButton
          key={item.label}
          item={item}
          position={getItemPosition(i)}
          size={itemSize}
          accentColor={item.color ?? accentColor}
          index={i}
        />
      ))}
    </group>
  );

  if (floating) {
    return (
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        {content}
      </Float>
    );
  }

  return content;
}

/* ── Internal Button ─────────────────────────────────────────────────────── */

function SpatialMenuButton({
  item,
  position,
  size,
  accentColor,
}: {
  item: SpatialMenuItem;
  position: [number, number, number];
  size: number;
  accentColor: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);

  useFrame(() => {
    if (!meshRef.current) return;
    targetScale.current = hovered ? 1.1 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
      0.15
    );
  });

  return (
    <group position={position}>
      {/* Button body */}
      <RoundedBox
        ref={meshRef}
        args={[size * 2, size * 0.8, 0.04]}
        radius={0.04}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={item.onClick}
      >
        <meshPhysicalMaterial
          color={hovered ? "#1a1a22" : "#111115"}
          metalness={0.05}
          roughness={0.3}
          transparent
          opacity={0.9}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={hovered ? 0.2 : 0.02}
        />
      </RoundedBox>

      {/* Glow ring */}
      <RoundedBox
        args={[size * 2 + 0.02, size * 0.82, 0.02]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, -0.02]}
      >
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.2 : 0.04}
        />
      </RoundedBox>

      {/* Icon */}
      {item.icon && (
        <Text
          position={[-size * 0.55, 0, 0.03]}
          fontSize={0.12}
          anchorX="center"
          anchorY="middle"
        >
          {item.icon}
        </Text>
      )}

      {/* Label */}
      <Text
        position={[item.icon ? 0.05 : 0, 0, 0.03]}
        fontSize={0.08}
        color="#fafafa"
        anchorX="center"
        anchorY="middle"
        maxWidth={size * 1.5}
      >
        {item.label}
      </Text>
    </group>
  );
}
