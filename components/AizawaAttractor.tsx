import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AizawaParams, VisualizationSettings } from '../types';

interface Props {
  params: AizawaParams;
  settings: VisualizationSettings;
}

const AizawaAttractor: React.FC<Props> = ({ params, settings }) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Initial state setup
  const { positions, colors, velocities } = useMemo(() => {
    const count = settings.particleCount;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3); // Store velocity for each particle

    for (let i = 0; i < count; i++) {
      // Initialize in a small area to watch them explode outwards
      pos[i * 3] = (Math.random() - 0.5) * 0.1 + 0.1;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      
      // Initialize random colors
      col[i * 3] = 1;
      col[i * 3 + 1] = 1;
      col[i * 3 + 2] = 1;
    }

    return { 
      positions: pos, 
      colors: col,
      velocities: vel 
    };
  }, [settings.particleCount]); // Re-init if count changes

  // Update loop
  useFrame((state, delta) => {
    if (!geometryRef.current) return;

    const { a, b, c, d, e, f } = params;
    // Cap delta to prevent explosion on tab switch
    const dt = Math.min(delta, 0.1) * settings.speed; 
    
    const posAttribute = geometryRef.current.attributes.position;
    const colorAttribute = geometryRef.current.attributes.color;

    // We can't type check array access inside tight loops easily without performance hit,
    // so we trust the indices.
    const count = settings.particleCount;
    const colorObj = new THREE.Color();

    for (let i = 0; i < count; i++) {
      let x = positions[i * 3];
      let y = positions[i * 3 + 1];
      let z = positions[i * 3 + 2];

      // Runge-Kutta 4th Order Integration (RK4) for stability
      // dx/dt = (z - b) * x - d * y
      // dy/dt = d * x + (z - b) * y
      // dz/dt = c + a * z - z^3 / 3 - (x^2 + y^2) * (1 + e * z) + f * z * x^3

      const computeDerivatives = (tx: number, ty: number, tz: number) => {
         const dx = (tz - b) * tx - d * ty;
         const dy = d * tx + (tz - b) * ty;
         const dz = c + a * tz - (tz * tz * tz) / 3 - (tx * tx + ty * ty) * (1 + e * tz) + f * tz * (tx * tx * tx);
         return { dx, dy, dz };
      };

      // k1
      const k1 = computeDerivatives(x, y, z);
      
      // k2
      const k2 = computeDerivatives(x + k1.dx * dt * 0.5, y + k1.dy * dt * 0.5, z + k1.dz * dt * 0.5);

      // k3
      const k3 = computeDerivatives(x + k2.dx * dt * 0.5, y + k2.dy * dt * 0.5, z + k2.dz * dt * 0.5);

      // k4
      const k4 = computeDerivatives(x + k3.dx * dt, y + k3.dy * dt, z + k3.dz * dt);

      // Average derivatives for final step
      const vx = (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) / 6;
      const vy = (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) / 6;
      const vz = (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz) / 6;

      // Final update
      x += vx * dt;
      y += vy * dt;
      z += vz * dt;

      // Reset if out of bounds or NaN (stability check)
      if (isNaN(x) || isNaN(y) || isNaN(z) || Math.abs(x) > 50 || Math.abs(y) > 50 || Math.abs(z) > 50) {
         x = (Math.random() - 0.5) * 2;
         y = (Math.random() - 0.5) * 2;
         z = (Math.random() - 0.5) * 2;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color mapping based on velocity magnitude
      const velocity = Math.sqrt(vx * vx + vy * vy + vz * vz);
      
      // Normalize velocity: 0 to ~3.5 is the typical range for interesting dynamics
      // Clamp at 1.0 for color mapping
      const t = Math.min(velocity / 3.5, 1.0);

      // Gradient: 
      // Slow (Blue-ish/Cyan) -> Fast (Red/Orange/White)
      // Hue: 0.6 (Blue) -> 0.0 (Red)
      // Lightness: 0.5 -> 0.8 (Brighter when faster)
      colorObj.setHSL(0.6 * (1.0 - t), 1.0, 0.5 + 0.3 * t);
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    posAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={settings.pointSize}
        vertexColors
        transparent
        opacity={settings.opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default AizawaAttractor;