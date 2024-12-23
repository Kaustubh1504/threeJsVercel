import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF , OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

// Component for the 3D Model
function Model(props) {
  const { scene } = useGLTF("/kala_brown.gltf"); // Replace with the path to your GLTF file
  return <primitive object={scene} {...props} />;
}

// Main App Component
function App() {
  const { gl } = useThree();
  const controller = useRef();

  useEffect(() => {
    // Enable WebXR
    gl.xr.enabled = true;

    // Add the AR button to the document
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    return () => {
      // Clean up the AR button
      document.body.removeChild(arButton);
    };
  }, [gl]);

  const onSelect = () => {
    const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    if (controller.current) {
      const { matrixWorld } = controller.current;
      mesh.position.set(0, 0, -0.3).applyMatrix4(matrixWorld);
      mesh.quaternion.setFromRotationMatrix(matrixWorld);
    }

    gl.scene.add(mesh);
  };

  useFrame(() => {
    if (controller.current) {
      controller.current.addEventListener("select", onSelect);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive ref={controller} object={gl.xr.getController(0)} />
      {/* Add the 3D model into the AR scene */}
      <Model scale={0.2} position={[0, 0, -1]} />
    </>
  );
}

// ARScene Component
function ARScene() {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute"}}>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      <App />
    </Canvas>
  );
}

export default ARScene;
