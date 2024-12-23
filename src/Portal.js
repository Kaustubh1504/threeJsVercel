import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';

function Portal({ modelPath, portalPosition, portalRotation }) {
  const { scene } = useGLTF(modelPath);
  const portalRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (portalRef.current) {
      // Align the portal's rotation to face the camera
      portalRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={portalRef} position={portalPosition} rotation={portalRotation}>
      {/* Portal Frame */}
      <mesh>
        <ringGeometry args={[1.1, 1.2, 64]} />
        <meshStandardMaterial color="gold" />
      </mesh>
      {/* Portal Inner */}
      <mesh>
        <circleGeometry args={[1.1, 64]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* 3D Model Inside Portal */}
      <group scale={[0.5, 0.5, 0.5]} position={[0, 0, -1]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default Portal;
