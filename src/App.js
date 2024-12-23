import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model(props) {
  const { scene } = useGLTF("/kala_brown.gltf");
  return <primitive object={scene} {...props} />;
}

function App() {
  return (
    
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
      <color attach="background" args={["#101010"]} />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        enableRotate={true} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={0} 
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Model scale={0.5} />
    </Canvas>
  );
}

export default App;
