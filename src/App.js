// import { Canvas , ARCanvas} from "@react-three/fiber";
// import { useGLTF, OrbitControls } from "@react-three/drei";

// function Model(props) {
//   const { scene } = useGLTF("/kala_brown.gltf");
//   return <primitive object={scene} {...props} />;
// }

// function App() {
//   return (
    
//     <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
//       <color attach="background" args={["#101010"]} />
//       <OrbitControls 
//         enableZoom={true} 
//         enablePan={true} 
//         enableRotate={true} 
//         maxPolarAngle={Math.PI / 2} 
//         minPolarAngle={0} 
//       />
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />
//       <Model scale={0.5} />
//     </Canvas>
//   );
// }

// export default App;


import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

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
      <hemisphereLight intensity={3} color={0xffffff} groundColor={0xbbbbff} position={[0.5, 1, 0.25]} />
      <primitive ref={controller} object={gl.xr.getController(0)} />
    </>
  );
}

function ARScene() {
  return (
    <Canvas>
      <App />
    </Canvas>
  );
}

export default ARScene;
