/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Euler } from "three";
import { Float, Text, useGLTF } from "@react-three/drei";
import Model from "./Model";

// Setting to true causes encoding of the colors between native Three.js and React-Three-Fiber
THREE.ColorManagement.legacyMode = false;

// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Material
const floor1Material = new THREE.MeshStandardMaterial({
  color: "#111111",
  metalness: 0,
  roughness: 0,
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "#222222",
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "red",
  emissive: "red",
  emissiveIntensity: 7.5,
  toneMapped: false,
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#887777",
  metalness: 0,
  roughness: 0,
});

// Starter block
export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          scale={4}
          font={"/bebas-neue-v9-latin-regular.woff"}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign={"center"}
          position={[0.9, 0.65, 0]}
          rotation-y={-0.25}
        >
          WHERE'S MY CANDY?
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      // Floor
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
    </group>
  );
}

// End block
export function BlockEnd({ position = [0, 0, 0] }) {
  const model = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lollipop/model.gltf"
  );
  const rigidModel = useRef();
  const realModel = useRef();
  model.scene.children.forEach((mesh) => (mesh.castShadow = true));

  // useFrame((state, delta) =>
  // {
  //     const time = state.clock.getElapsedTime()

  //     const eulerRotation = new THREE.Euler(0, time, 0)
  //     const quaternionRotation = new THREE.Quaternion()
  //     quaternionRotation.setFromEuler(eulerRotation)

  //     rigidModel.current.setRotation(quaternionRotation)
  // })

  return (
    <group position={position}>
      <Text
        font={"/bebas-neue-v9-latin-regular.woff"}
        scale={8}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      // Model
      <RigidBody
        ref={rigidModel}
        type={"kinematicPosition"}
        colliders={"hull"}
        restitution={0.2}
        friction={0}
      >
        <Float floatIntensity={2.5} rotationIntensity={2.5}>
          {/* <Model /> */}
          <primitive
            ref={realModel}
            object={model.scene}
            position={[0, 0.85, 0]}
            scale={1.5}
          />
        </Float>
      </RigidBody>
      // Floor
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
      />
    </group>
  );
}

// Spinner block
export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();

  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const eulerRotation = new THREE.Euler(0, time * speed, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);

    obstacle.current.setNextKinematicRotation(quaternionRotation);
  });

  return (
    <group position={position}>
      // Floor
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      // Obstacle
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

// Limbo block
export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      // Floor
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      // Obstacle
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

// Axe block
export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      // Floor
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      // Obstacle
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
    </group>
  );
}

export function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type={"fixed"} restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, length * 4]}
          position={[2.15, 0.75, -(length * 2) + 2]}
          castShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, length * 4]}
          position={[-2.15, 0.75, -(length * 2) + 2]}
          receiveShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          position={[0, 0.75, -(length * 4) + 2]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export function Level({
  count = 10,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
}
