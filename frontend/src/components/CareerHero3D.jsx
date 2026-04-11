import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Sparkles, Icosahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

function MorphingCore({ position = [0, 0, 0] }) {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.2;
            meshRef.current.rotation.z = t * 0.1;
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Icosahedron args={[1.8, 0]} ref={meshRef}>
                    <meshPhysicalMaterial
                        color="#8b5cf6" // violet-500
                        roughness={0.2}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        wireframe={true}
                        emissive="#6d28d9"
                        emissiveIntensity={0.5}
                    />
                </Icosahedron>
                <Icosahedron args={[1.75, 0]}>
                    <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
                </Icosahedron>
            </Float>
        </group>
    );
}

function Electron({ radius = 3, speed = 1, color = "#0ea5e9", offset = 0 }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed + offset;
        if (ref.current) {
            ref.current.position.x = Math.sin(t) * radius;
            ref.current.position.z = Math.cos(t) * radius;
            ref.current.position.y = Math.sin(t * 1.5) * (radius * 0.3);
        }
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
    );
}

function OrbitalRings({ position = [0, 0, 0] }) {
    return (
        <group position={position} rotation={[Math.PI / 6, Math.PI / 6, 0]}>
            <Torus args={[3, 0.02, 16, 100]}>
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
            </Torus>
            <Torus args={[4.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
            </Torus>
            <Electron radius={3} speed={0.8} color="#38bdf8" />
            <Electron radius={4.5} speed={0.5} color="#a78bfa" offset={2} />
        </group>
    )
}

function ResponsiveScene() {
    const { viewport } = useThree();
    const isMobile = viewport.width < 7; // Approximate check

    // Adjust position based on screen size
    // On desktop, move to right. On mobile, keep centered or move down.
    const position = isMobile ? [0, 1, 0] : [3.5, 0, 0];
    const scale = isMobile ? 0.7 : 1;

    return (
        <group position={position} scale={scale}>
            <MorphingCore />
            <OrbitalRings />
        </group>
    );
}

export default function CareerHero3D() {
    return (
        <div className="absolute inset-0 w-full h-full z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />

                <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={0.5} color="#0ea5e9" />

                <ResponsiveScene />

                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    enablePan={false}
                    enableDamping
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}
