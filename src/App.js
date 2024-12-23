// // // // import React, { useRef, useEffect } from "react";
// // // // import { Canvas, useFrame, useThree } from "@react-three/fiber";
// // // // import { useGLTF , OrbitControls } from "@react-three/drei";
// // // // import * as THREE from "three";
// // // // import { ARButton } from "three/addons/webxr/ARButton.js";

// // // // // Component for the 3D Model
// // // // function Model(props) {
// // // //   const { scene } = useGLTF("/kala_brown.gltf"); // Replace with the path to your GLTF file
// // // //   return <primitive object={scene} {...props} />;
// // // // }

// // // // // Main App Component
// // // // function App() {
// // // //   const { gl } = useThree();
// // // //   const controller = useRef();

// // // //   useEffect(() => {
// // // //     // Enable WebXR
// // // //     gl.xr.enabled = true;

// // // //     // Add the AR button to the document
// // // //     const arButton = ARButton.createButton(gl);
// // // //     document.body.appendChild(arButton);

// // // //     return () => {
// // // //       // Clean up the AR button
// // // //       document.body.removeChild(arButton);
// // // //     };
// // // //   }, [gl]);

// // // //   const onSelect = () => {
// // // //     const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);
// // // //     const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
// // // //     const mesh = new THREE.Mesh(geometry, material);

// // // //     if (controller.current) {
// // // //       const { matrixWorld } = controller.current;
// // // //       mesh.position.set(0, 0, -0.3).applyMatrix4(matrixWorld);
// // // //       mesh.quaternion.setFromRotationMatrix(matrixWorld);
// // // //     }

// // // //     gl.scene.add(mesh);
// // // //   };

// // // //   useFrame(() => {
// // // //     if (controller.current) {
// // // //       controller.current.addEventListener("select", onSelect);
// // // //     }
// // // //   });

// // // //   return (
// // // //     <>
// // // //       <ambientLight intensity={0.5} />
// // // //       <directionalLight position={[10, 10, 5]} intensity={1} />
// // // //       <primitive ref={controller} object={gl.xr.getController(0)} />
// // // //       {/* Add the 3D model into the AR scene */}
// // // //       <Model scale={0.2} position={[0, 0, -1]} />
// // // //     </>
// // // //   );
// // // // }

// // // // // ARScene Component
// // // // function ARScene() {
// // // //   return (
// // // //     <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute"}}>
// // // //       <OrbitControls
// // // //         enableZoom={true}
// // // //         enablePan={true}
// // // //         enableRotate={true}
// // // //         maxPolarAngle={Math.PI / 2}
// // // //         minPolarAngle={0}
// // // //       />
// // // //       <App />
// // // //     </Canvas>
// // // //   );
// // // // }

// // // // export default ARScene;




// // // // import { Canvas } from "@react-three/fiber";
// // // // import { useGLTF, OrbitControls, MeshPortalMaterial } from "@react-three/drei";

// // // // function Model(props) {
// // // //   const { scene } = useGLTF("/kala_brown.gltf");
// // // //   return <primitive object={scene} {...props} />;
// // // // }

// // // // function App() {
// // // //   return (

// // // //     <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
// // // //       <color attach="background" args={["#101010"]} />
// // // //       <MeshPortalMaterial transparent blur={0.5}>
// // // //         <OrbitControls
// // // //           enableZoom={true}
// // // //           enablePan={true}
// // // //           enableRotate={true}
// // // //           maxPolarAngle={Math.PI / 2}
// // // //           minPolarAngle={0}
// // // //         />
// // // //         <ambientLight intensity={0.5} />
// // // //         <directionalLight position={[10, 10, 5]} intensity={1} />
// // // //         <Model scale={0.01} />
// // // //       </MeshPortalMaterial>
// // // //     </Canvas>



// // // //   );
// // // // }

// // // // export default App;


// // // import * as THREE from 'three'
// // // import { Canvas, extend } from '@react-three/fiber'
// // // import { useGLTF, MeshPortalMaterial, CameraControls, Text, Sky } from '@react-three/drei'
// // // import { geometry } from 'maath'

// // // extend(geometry)
// // // const GOLDENRATIO = 1.61803398875
// // // const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
// // // const yPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1)

// // // export const App = () => (
// // //   <Canvas gl={{ localClippingEnabled: true }} camera={{ fov: 75, position: [0, 0, 1.5] }} eventSource={document.getElementById('root')} eventPrefix="client" style={{height:"100%"}}>
// // //     <color attach="background" args={['#f0f0f0']} />
// // //     <Frame id="01" name="Jesse" author="McCree">
// // //       <Sky />
// // //       <Model position={[0, -2, 0]} />
// // //     </Frame>
// // //     <Model clip position={[0, -2, 0]} />
// // //     <CameraControls makeDefault minAzimuthAngle={-Math.PI / 2.5} maxAzimuthAngle={Math.PI / 2.5} minPolarAngle={0.5} maxPolarAngle={Math.PI / 2} />
// // //   </Canvas>
// // // )

// // // /*
// // // Auto-generated by: https://github.com/pmndrs/gltfjsx
// // // Command: npx gltfjsx@6.2.3 mccree.glb
// // // Author: Seafoam (https://sketchfab.com/seafoam)
// // // License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
// // // Source: https://sketchfab.com/3d-models/low-poly-mccree-38aedc02c0b2412babdc4d0eac7c6803
// // // Title: Low poly McCree
// // // */
// // // function Model({ clip, ...props }) {
// // //   const { nodes, materials } = useGLTF('/low_poly_mccree-transformed.glb')
// // //   // return <primitive object={scene} {...props} />;

// // //   return (
// // //     <mesh geometry={nodes.base.geometry} {...props} dispose={null}>
// // //       <meshBasicMaterial map={materials.PaletteMaterial001.map} side={THREE.DoubleSide} clippingPlanes={clip ? [zPlane, yPlane] : null} />
// // //     </mesh>
// // //   )
// // // }

// // // function Frame({ id, name, author, bg, width = 1, height = GOLDENRATIO, children, ...props }) {
// // //   return (
// // //     <group {...props}>
// // //       <Text  color="black" fontSize={0.25} letterSpacing={-0.025} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]}>
// // //         {name}
// // //       </Text>
// // //       <Text color="black" fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]}>
// // //         /{id}
// // //       </Text>
// // //       <Text color="black" fontSize={0.04} anchorX="left" position={[0.0, -0.677, 0.01]}>
// // //         {author}
// // //       </Text>
// // //       <mesh name={id}>
// // //         <roundedPlaneGeometry args={[width, height, 0.1]} />
// // //         <MeshPortalMaterial>{children}</MeshPortalMaterial>
// // //       </mesh>
// // //       <mesh name={id} position={[0, 0, -0.001]}>
// // //         <roundedPlaneGeometry args={[width + 0.05, height + 0.05, 0.12]} />
// // //         <meshBasicMaterial color="black" />
// // //       </mesh>
// // //     </group>
// // //   )
// // // }


// // // export default App;


// // import { Suspense, useState } from "react";
// // import * as THREE from "three";
// // import { Canvas, useLoader } from "@react-three/fiber";
// // import {
// //   Mask,
// //   useMask,
// //   Float,
// //   OrbitControls,
// //   MeshDistortMaterial,
// // } from "@react-three/drei";
// // import { ARButton, XR, Interactive } from "@react-three/xr";

// // function MaskedContent({ invert, ...props }) {
// //   /* The useMask hook has to refer to the mask id defined below, the content
// //    * will then be stamped out.
// //    */
// //   const stencil = useMask(1, invert);

// //   const texture = useLoader(
// //     THREE.TextureLoader,
// //     "cyberpunk_a_dark_city_during_the_night_with_neon_l.jpg"
// //   );
// //   return (
// //     <mesh>
// //       <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
// //       <meshBasicMaterial
// //         attach="material"
// //         map={texture}
// //         side={THREE.BackSide}
// //         {...stencil}
// //       />
// //     </mesh>
// //   );
// // }

// // export function App() {
// //   const [invert, setInvert] = useState(false);
// //   const [colorWrite, setColorWrite] = useState(true);
// //   const depthWrite = false;

// //   const onSelect = () => {
// //     setInvert(!invert);
// //     setColorWrite(!colorWrite);
// //   };

// //   return (
// //     <>
// //       <ARButton />
// //       <Canvas camera={{ position: [0, 0, 5] }}>
// //         <XR>
// //           <hemisphereLight intensity={1} groundColor="red" />
// //           <Suspense fallback={null}>
// //             <Interactive onSelect={onSelect}>
// //               <Float
// //                 floatIntensity={3}
// //                 rotationIntensity={1}
// //                 speed={5}
// //                 position={[0, 1, -2]}
// //               >
// //                 <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite}>
// //                   {(spread) => (
// //                     <>
// //                       <planeGeometry args={[1, 1, 128, 128]} />
// //                       <MeshDistortMaterial
// //                         distort={0.5}
// //                         radius={1}
// //                         speed={10}
// //                         {...spread}
// //                       />
// //                     </>
// //                   )}
// //                 </Mask>
// //               </Float>
// //             </Interactive>

// //             <MaskedContent invert={invert} />
// //             <OrbitControls makeDefault />
// //           </Suspense>
// //         </XR>
// //       </Canvas>
// //     </>
// //   );
// // }

// // export default App;

// import * as THREE from 'three'
// import { useEffect, useRef, useState } from 'react'
// import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
// import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Preload, useGLTF } from '@react-three/drei'
// import { useRoute, useLocation } from 'wouter'
// import { easing, geometry } from 'maath'
// import { suspend } from 'suspend-react'

// extend(geometry)
// // const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
// // const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

// function Model(props) {
//   const { scene } = useGLTF("/kala_brown.gltf"); // Replace with the path to your GLTF file
//   return <primitive object={scene} {...props} />;
// }

// export const App = () => (
//   <Canvas flat camera={{ fov: 75, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client" height="800px" style={{ height: "100%" }}>
//     <color attach="background" args={['#f0f0f0']} />
//     {/* <Frame id="01" name={`picknles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
//       <Gltf src="kala_brown.gltf" scale={0.01} position={[0, -0.7, -2]} />
//     </Frame> */}
//     <Frame id="02" name="tea" author="Omar Faruq Tawsif">
//       {/* <Gltf src="fiesta_tea-transformed.glb" position={[0, -2, -3]} /> */}
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />
//       <Model scale={0.01} position={[0, -0.7, -2]} />
//     </Frame>
//     {/* <Frame id="03" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
//       <Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} />
//     </Frame> */}
//     <Rig />
//     <Preload all />
//   </Canvas>
// )

// function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
//   const portal = useRef()
//   const [, setLocation] = useLocation()
//   const [, params] = useRoute('/item/:id')
//   const [hovered, hover] = useState(false)
//   useCursor(hovered)
//   useFrame((state, dt) => easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt))
//   return (
//     <group {...props}>
//       <Text fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
//         {name}
//       </Text>
//       <Text fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
//         /{id}
//       </Text>
//       <Text fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
//         {author}
//       </Text>
//       <mesh name={id} onDoubleClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}>
//         <roundedPlaneGeometry args={[width, height, 0.1]} />
//         <MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
//           <color attach="background" args={[bg]} />
//           {children}
//         </MeshPortalMaterial>
//       </mesh>
//     </group>
//   )
// }

// function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
//   const { controls, scene } = useThree()
//   const [, params] = useRoute('/item/:id')
//   useEffect(() => {
//     const active = scene.getObjectByName(params?.id)
//     if (active) {
//       active.parent.localToWorld(position.set(0, 0.5, 0.25))
//       active.parent.localToWorld(focus.set(0, 0, -2))
//     }
//     controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
//   })
//   return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
// }

// export default App;


import React, { useRef } from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import * as BABYLON from "babylonjs";
// import "babylonjs-loaders";
import "@babylonjs/gui";
// import * from '@babylonjs/gui/2D';
import * as GUI from "@babylonjs/gui";
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D';

// import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
// import "./App.css";



let box;

const createScene = async function (scene,canvas) {

  // Creates a basic Babylon Scene object (non-mesh)
  // const scene = new BABYLON.Scene(engine);

  // Creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);

  // Cargets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // Attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // AR availability check and GUI in non-AR mode
  const arAvailable = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');


  console.log(AdvancedDynamicTexture);


  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "FullscreenUI"
  );

  const rectangle = new GUI.Rectangle("rect");
  rectangle.background = "black";
  rectangle.color = "blue";
  rectangle.width = "80%";
  rectangle.height = "50%";

  advancedTexture.addControl(rectangle);
  const nonXRPanel = new GUI.StackPanel();
  rectangle.addControl(nonXRPanel);

  const text1 = new GUI.TextBlock("text1");
  text1.fontFamily = "Helvetica";
  text1.textWrapping = true;
  text1.color = "white";
  text1.fontSize = "14px";
  text1.height = "400px"
  text1.paddingLeft = "10px";
  text1.paddingRight = "10px";

  if (!arAvailable) {
    text1.text = "AR is not available in your system. Please make sure you use a supported device such as a Meta Quest 3 or a modern Android device and a supported browser like Chrome.\n \n Make sure you have Google AR services installed and that you enabled the WebXR incubation flag under chrome://flags";
    nonXRPanel.addControl(text1);
    return scene;
  } else {
    text1.text = "WebXR Demo: AR Portal.\n \n Please enter AR with the button on the lower right corner to start. Once in AR, look at the floor for a few seconds (and move a little): the hit-testing ring will appear. Then click anywhere on the screen...";
    nonXRPanel.addControl(text1);
  }

  // Create the WebXR Experience Helper for an AR Session (it initializes the XR scene, creates an XR Camera, 
  // initialize the features manager, create an HTML UI button to enter XR,...)
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local-floor",
      onError: (error) => {
        alert(error);
      }
    },
    optionalFeatures: true
  });


  //Get the Feature Manager and from it the HitTesting fearture and the xrcamera
  const fm = xr.baseExperience.featuresManager;
  const xrTest = fm.enableFeature(BABYLON.WebXRHitTest.Name, "latest");
  const xrCamera = xr.baseExperience.camera

  //Add glow layer, which will be used in the portal and the marker
  const gl = new BABYLON.GlowLayer("glow", scene, {
    mainTextureSamples: 4,
    mainTextureFixedSize: 256,
    blurKernelSize: 100
  });

  //Create neonMaterial, which will be used in the portal
  const neonMaterial = new BABYLON.StandardMaterial("neonMaterial", scene);
  neonMaterial.emissiveColor = new BABYLON.Color3(0.35, 0.96, 0.88)

  //Create a marker that will be used to represent the hitTest position
  const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 });
  marker.isVisible = false;
  marker.rotationQuaternion = new BABYLON.Quaternion();
  gl.addIncludedOnlyMesh(marker);
  marker.material = neonMaterial;

  //Update the position/rotation of the marker with HitTest information
  let hitTest;
  xrTest.onHitTestResultObservable.add((results) => {
    if (results.length) {
      marker.isVisible = true;
      hitTest = results[0];
      hitTest.transformationMatrix.decompose(undefined, marker.rotationQuaternion, marker.position);
    } else {
      marker.isVisible = false;
      hitTest = undefined;
    }
  });

  //Set-up root Transform nodes
  const rootOccluder = new BABYLON.TransformNode("rootOccluder", scene);
  rootOccluder.rotationQuaternion = new BABYLON.Quaternion();
  const rootScene = new BABYLON.TransformNode("rootScene", scene);
  rootScene.rotationQuaternion = new BABYLON.Quaternion();
  const rootPilar = new BABYLON.TransformNode("rootPilar", scene);
  rootPilar.rotationQuaternion = new BABYLON.Quaternion();

  //Create Occulers which will hide the 3D scene
  const oclVisibility = 0.001;
  const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 500, depth: 500, height: 0.001 }, scene); // size should be big enough to hideall you want
  const hole = BABYLON.MeshBuilder.CreateBox("hole", { size: 2, width: 1, height: 0.01 }, scene);

  const groundCSG = BABYLON.CSG.FromMesh(ground);
  const holeCSG = BABYLON.CSG.FromMesh(hole);
  const booleanCSG = groundCSG.subtract(holeCSG);
  const booleanRCSG = holeCSG.subtract(groundCSG);
  //Create the main occluder - to see the 3D scene through the portal when in real world
  const occluder = booleanCSG.toMesh("occluder", null, scene);
  //Create thee reverse occluder - to see the real world  through the portal when inside the 3D scene
  const occluderR = booleanRCSG.toMesh("occluderR", null, scene);
  //Create an occluder box to hide the 3D scene around the user when in real world
  const occluderFloor = BABYLON.MeshBuilder.CreateBox("ground", { width: 7, depth: 7, height: 0.001 }, scene);
  const occluderTop = BABYLON.MeshBuilder.CreateBox("occluderTop", { width: 7, depth: 7, height: 0.001 }, scene);
  const occluderRight = BABYLON.MeshBuilder.CreateBox("occluderRight", { width: 7, depth: 7, height: 0.001 }, scene);
  const occluderLeft = BABYLON.MeshBuilder.CreateBox("occluderLeft", { width: 7, depth: 7, height: 0.001 }, scene);
  const occluderback = BABYLON.MeshBuilder.CreateBox("occluderback", { width: 7, depth: 7, height: 0.001 }, scene);
  const occluderMaterial = new BABYLON.StandardMaterial("om", scene);
  occluderMaterial.disableLighting = true; // We don't need anything but the position information
  occluderMaterial.forceDepthWrite = true; //Ensure depth information is written to the buffer so meshes further away will not be drawn
  occluder.material = occluderMaterial;
  occluderR.material = occluderMaterial;
  occluderFloor.material = occluderMaterial;
  occluderTop.material = occluderMaterial;
  occluderRight.material = occluderMaterial;
  occluderLeft.material = occluderMaterial;
  occluderback.material = occluderMaterial;
  ground.dispose();
  hole.dispose();


  //Load Virtual world: the "Hill Valley Scene" and configure occluders
  // engine.displayLoadingUI(); //Display the loading screen as the scene takes a few seconds to load
  const virtualWorldResult = await BABYLON.SceneLoader.ImportMeshAsync("", "https://www.babylonjs.com/Scenes/hillvalley/", "HillValley.babylon", scene);
  // engine.hideLoadingUI(); //Hide Loadingscreen once the scene is loaded
  for (let child of virtualWorldResult.meshes) {
    child.renderingGroupId = 1;
    child.parent = rootScene;
  }

  occluder.renderingGroupId = 0;
  occluderR.renderingGroupId = 0;
  occluderFloor.renderingGroupId = 0;
  occluderTop.renderingGroupId = 0;
  occluderRight.renderingGroupId = 0;
  occluderLeft.renderingGroupId = 0;
  occluderback.renderingGroupId = 0;

  occluder.parent = rootOccluder;
  occluderR.parent = rootOccluder;
  occluderFloor.parent = rootOccluder;
  occluderTop.parent = rootOccluder;
  occluderRight.parent = rootOccluder;
  occluderLeft.parent = rootOccluder;
  occluderback.parent = rootOccluder;

  occluder.isVisible = true;
  occluderR.isVisible = false;
  occluderFloor.isVisible = true;
  occluderTop.isVisible = true;
  occluderRight.isVisible = true;
  occluderLeft.isVisible = true;
  occluderback.isVisible = true;

  occluder.visibility = oclVisibility;
  occluderR.visibility = oclVisibility;
  occluderFloor.visibility = oclVisibility;
  occluderTop.visibility = oclVisibility;
  occluderRight.visibility = oclVisibility;
  occluderLeft.visibility = oclVisibility;
  occluderback.visibility = oclVisibility;


  scene.setRenderingAutoClearDepthStencil(1, false, false, false); // Do not clean buffer info to ensure occlusion
  scene.setRenderingAutoClearDepthStencil(0, true, true, true); // Clean for 1rst frame
  scene.autoClear = true;

  // Make the virtual world and occluders invisible before portal appears
  rootScene.setEnabled(false);
  rootOccluder.setEnabled(false);

  let portalAppearded = false;
  let portalPosition = new BABYLON.Vector3();

  scene.onPointerDown = (evt, pickInfo) => {

    if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR && !portalAppearded) {

      portalAppearded = true;

      //Enable the virtual world and move it to the hitTest position
      rootScene.setEnabled(true);
      rootOccluder.setEnabled(true);

      hitTest.transformationMatrix.decompose(undefined, undefined, portalPosition);

      rootOccluder.position = portalPosition;
      rootScene.position = portalPosition;

      //Move virtual scene 1 unit lower (this HillValley scene is at 1 above origin - and the grass at 1.2)
      rootScene.translate(BABYLON.Axis.Y, -1);

      //Positionate in front the car
      rootScene.translate(BABYLON.Axis.X, 29);
      rootScene.translate(BABYLON.Axis.Z, -11);


      //Align occluders
      rootOccluder.translate(BABYLON.Axis.Y, 3);
      rootOccluder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(-1, 0, 0), Math.PI / 2);
      rootOccluder.translate(BABYLON.Axis.Z, -2);
      occluderFloor.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(-1, 0, 0), Math.PI / 2);
      occluderFloor.translate(BABYLON.Axis.Y, 1);
      occluderFloor.translate(BABYLON.Axis.Z, 3.5);
      occluderTop.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(-1, 0, 0), Math.PI / 2);
      occluderTop.translate(BABYLON.Axis.Y, -2);
      occluderTop.translate(BABYLON.Axis.Z, 3.5);
      occluderback.translate(BABYLON.Axis.Y, 7);
      occluderback.translate(BABYLON.Axis.Z, 2);
      occluderRight.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI / 2);
      occluderRight.translate(BABYLON.Axis.Y, -3.4);
      occluderRight.translate(BABYLON.Axis.X, 3.5);
      occluderLeft.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI / 2);
      occluderLeft.translate(BABYLON.Axis.Y, 3.4);
      occluderLeft.translate(BABYLON.Axis.X, 3.5);

      //Add mesh for portal
      const pilar1 = BABYLON.MeshBuilder.CreateBox("pilar1", { height: 2, width: .1, depth: .1 });
      const pilar2 = BABYLON.MeshBuilder.CreateBox("pilar2", { height: 2, width: .1, depth: .1 });
      const pilar3 = BABYLON.MeshBuilder.CreateBox("pilar3", { height: 1.1, width: .1, depth: .1 });

      //Move pilars to make a portal
      pilar2.translate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);
      pilar3.addRotation(0, 0, Math.PI / 2);
      pilar3.translate(BABYLON.Axis.Y, 1, BABYLON.Space.LOCAL);
      pilar3.translate(BABYLON.Axis.Y, -.5, BABYLON.Space.LOCAL);

      //Set-up transformnode to move portal mesh 
      pilar1.parent = rootPilar;
      pilar2.parent = rootPilar;
      pilar3.parent = rootPilar;

      //move portal mesh to hitTest position
      rootPilar.position = portalPosition;

      //align portal mesh with occluder 
      rootPilar.translate(BABYLON.Axis.Y, 1);
      rootPilar.translate(BABYLON.Axis.X, -.5);
      rootPilar.translate(BABYLON.Axis.Z, .05);  //push it a bit in virtual world to have it rendered in realworld

      //Add neon material and glowing effect to the portal
      gl.addIncludedOnlyMesh(pilar1);
      gl.addIncludedOnlyMesh(pilar2);
      gl.addIncludedOnlyMesh(pilar3);
      pilar1.material = neonMaterial;
      pilar2.material = neonMaterial;
      pilar3.material = neonMaterial;

      //add particle effects to the portal
      BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#488", scene, false).then(system => {
        system.emitter = pilar3;
      });
      BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#489", scene, false).then(system => {
        system.emitter = pilar1;
      });
      BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#489", scene, false).then(system => {
        system.emitter = pilar2;
      });

    }
  }

  //Hide GUI in AR mode
  xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
    rectangle.isVisible = false;
  })
  xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
    rectangle.isVisible = true;

  })

  //Rendering loop 
  scene.onBeforeRenderObservable.add(() => {

    marker.isVisible = !portalAppearded;

    if ((xrCamera !== undefined) && (portalPosition !== undefined)) {

      if (xrCamera.position.z > portalPosition.z) {

        // isInRealWorld = false;
        occluder.isVisible = false;
        occluderR.isVisible = true;
        occluderFloor.isVisible = false;
        occluderTop.isVisible = false;
        occluderRight.isVisible = false;
        occluderLeft.isVisible = false;
        occluderback.isVisible = false;

      }
      else {
        // isInRealWorld = true;
        occluder.isVisible = true;
        occluderR.isVisible = false;
        occluderFloor.isVisible = true;
        occluderTop.isVisible = true;
        occluderRight.isVisible = true;
        occluderLeft.isVisible = true;
        occluderback.isVisible = true;

      }
    }

  });

  return scene;

};


const onSceneReady = async (scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  await createScene(scene,canvas)

  // This attaches the camera to the canvas
  // camera.attachControl(canvas, true);

  // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  // const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // // Default intensity is 1. Let's dim the light a small amount
  // light.intensity = 0.7;

  // // Our built-in 'box' shape.
  // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // // Move the box upward 1/2 its height
  // box.position.y = 1;

  // // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};




/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};




// eslint-disable-next-line import/no-anonymous-default-export
export function App() {

  

  return (
    <div>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
    </div>
  )

}




export default App;

