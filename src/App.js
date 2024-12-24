import React, { useEffect, useRef } from "react";
import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/gui";
import * as GUI from "@babylonjs/gui";
import "./App.css";
import { WebXRSessionManager } from "babylonjs";
import * as BABYLON from "babylonjs";
import "@babylonjs/loaders/glTF/2.0";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders";
import { SceneLoader } from '@babylonjs/core/Loading';
import '@babylonjs/loaders';

const App = () => {
    const reactCanvas = useRef(null);
    let box;

    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        const createScene = async function (canvas) {

            // Creates a basic Babylon Scene object (non-mesh)
            // const scene = new BABYLON.Scene(engine);

            // Creates and positions a free camera (non-mesh)
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);

            // Cargets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            // Attaches the camera to the canvas
            camera.attachControl(canvas, true);

            // AR availability check and GUI in non-AR mode
            var arAvailable = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
            arAvailable = true;


            console.log("arAvailable", arAvailable);


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
            const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 }, scene);
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

            console.log("Is Gltf available...", SceneLoader.IsPluginForExtensionAvailable('.gltf'));
            //Load Virtual world: the "Hill Valley Scene" and configure occluders
            engine.displayLoadingUI(); //Display the loading screen as the scene takes a few seconds to load
            const virtualWorldResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/Kaustubh1504/crimeDoorArScenesTest/refs/heads/main/kala_brown.gltf", "", scene);
            console.log(virtualWorldResult)
            engine.hideLoadingUI(); //Hide Loadingscreen once the scene is loaded
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

                    // //Move virtual scene 1 unit lower (this HillValley scene is at 1 above origin - and the grass at 1.2)
                    // rootScene.translate(BABYLON.Axis.Y, -1);

                    // //Positionate in front the car
                    // rootScene.translate(BABYLON.Axis.X, 29);
                    // rootScene.translate(BABYLON.Axis.Z, -11);


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

        const JustOcclusion = async function (canvas) {
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;

            //scene.createDefaultCamera(1,1,1);
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());

            // This attaches the camera to the canvas
            camera.attachControl(true);

            //Create Transform Nodes
            const rootOccluder = new BABYLON.TransformNode("rootOccluder", scene);
            rootOccluder.rotationQuaternion = new BABYLON.Quaternion();
            const rootScene = new BABYLON.TransformNode("rootScene", scene);
            rootScene.rotationQuaternion = new BABYLON.Quaternion();
            const rootPilar = new BABYLON.TransformNode("rootPilar", scene);
            rootPilar.rotationQuaternion = new BABYLON.Quaternion();

            let camera01 = undefined;

            // Create the occluders
            let ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 500, depth: 500, height: 0.001 }, scene); // size should be big enough to hideall you want
            let hole = BABYLON.MeshBuilder.CreateBox("hole", { size: 2, width: 1, height: 0.01 }, scene);

            let groundCSG = BABYLON.CSG.FromMesh(ground);
            let holeCSG = BABYLON.CSG.FromMesh(hole);
            let booleanCSG = groundCSG.subtract(holeCSG);
            let booleanRCSG = holeCSG.subtract(groundCSG);
            let occluder = booleanCSG.toMesh("occluder", null, scene);
            let occluderR = booleanRCSG.toMesh("occluderR", null, scene);
            let occluderMaterial = new BABYLON.StandardMaterial("om", scene);
            occluderMaterial.forceDepthWrite = true;
            occluder.material = occluderMaterial;
            occluderR.material = occluderMaterial;
            ground.dispose();
            hole.dispose();


            const virtualWorldResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/Kaustubh1504/crimeDoorArScenesTest/refs/heads/main/kala_brown.gltf", "", scene);
            // console.log(virtualWorldResult)

            const scaleFactor = 0.03;
            for (let child of virtualWorldResult.meshes) {
                child.renderingGroupId = 1;
                child.parent = rootScene;
                child.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
            }

            scene.activeCamera.attachControl(canvas, false);

            occluder.renderingGroupId = 0;
            occluderR.renderingGroupId = 0;

            occluder.parent = rootOccluder;
            occluderR.parent = rootOccluder;

            occluder.isVisible = true;
            occluderR.isVisible = false;

            scene.setRenderingAutoClearDepthStencil(1, false, false, false);
            scene.setRenderingAutoClearDepthStencil(0, true, true, true);
            scene.autoClear = true;

            // console.log("scene.getCameraByName(Camera01)",scene.getCameraByName("camera1"))
            camera01 = scene.getCameraByName("camera1");
            camera01.position = new BABYLON.Vector3(-0.059, 2.745, -13.091);
            camera01.setTarget(new BABYLON.Vector3(0.020, 2.694, -12.095));

            // //Position occluder, align with floor and make it vertical
            rootOccluder.translate(new BABYLON.Vector3(0, 1, 0), 4);
            rootOccluder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(-1, 0, 0), Math.PI / 2);
            rootOccluder.translate(new BABYLON.Vector3(0, 0, -1), 1.85);



            // //Add mesh for portal
            let pilar1 = BABYLON.MeshBuilder.CreateBox("pilar1", { height: 2, width: .1, depth: .1 }, scene);
            let pilar2 = BABYLON.MeshBuilder.CreateBox("pilar2", { height: 2, width: .1, depth: .1 }, scene);
            let pilar3 = BABYLON.MeshBuilder.CreateBox("pilar3", { height: 1.1, width: .1, depth: .1 }, scene);

            // //move pilars to make a portal
            pilar2.translate(new BABYLON.Vector3(1, 0, 0), 1, BABYLON.Space.LOCAL);
            pilar3.addRotation(0, 0, Math.PI / 2);
            pilar3.translate(new BABYLON.Vector3(0, 1, 0), 1, BABYLON.Space.LOCAL);
            pilar3.translate(new BABYLON.Vector3(0, -.5, 0), 1, BABYLON.Space.LOCAL);

            // //add glow effect to the portal
            let gl = new BABYLON.GlowLayer("glow", scene, {
                mainTextureSamples: 4,
                mainTextureFixedSize: 256,
                blurKernelSize: 100
            });

            gl.addIncludedOnlyMesh(pilar1);
            gl.addIncludedOnlyMesh(pilar2);
            gl.addIncludedOnlyMesh(pilar3);

            const neonMaterial = new BABYLON.StandardMaterial("neonMaterial", scene);
            neonMaterial.emissiveColor = new BABYLON.Color3(0.35, 0.96, 0.88);

            //cylinder.material = neonMaterial;
            pilar1.material = neonMaterial;
            pilar2.material = neonMaterial;
            pilar3.material = neonMaterial;

            //add particle effects on portal
            BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#489", scene, false).then(system => {
                system.emitter = pilar3;
            });
            BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#489", scene, false).then(system => {
                system.emitter = pilar1;
            });
            BABYLON.ParticleHelper.ParseFromSnippetAsync("UY098C#489", scene, false).then(system => {
                system.emitter = pilar2;
            });

            //align portal with occluder 
            pilar1.parent = rootPilar;
            pilar2.parent = rootPilar;
            pilar3.parent = rootPilar;
            rootPilar.translate(new BABYLON.Vector3(0, 1, 0), 2.15);
            rootPilar.translate(new BABYLON.Vector3(1, 0, 0), -.5);
            rootPilar.translate(new BABYLON.Vector3(0, 0, 1), .05);  //push it a bit in virtual world to have it rendered in realworld



            scene.onBeforeRenderObservable.add(() => {

                if (camera01 !== undefined) {

                    if (camera01.position.z > 0) {
                        occluder.isVisible = false;
                        occluderR.isVisible = true;
                        scene.clipPlane = null;
                    }
                    else {
                        occluder.isVisible = true;
                        occluderR.isVisible = false;
                        scene.clipPlane = new BABYLON.Plane(0, 0, -1, -0.001);
                    }
                }

            });

            return scene;
        }

        const onSceneReady = async (scene) => {
            const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
            camera.setTarget(Vector3.Zero());
            const canvas = scene.getEngine().getRenderingCanvas();
            camera.attachControl(canvas, true);

            // await JustOcclusion(canvas)

            // await createScene();

            const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            light.intensity = 0.7;
            const dirLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            dirLight.position = new Vector3(0, 5, -5);

            var arAvailable = await WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
            arAvailable = true; // remove this line 


            const advancedTexture = new GUI.AdvancedDynamicTexture(
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

            // console.log("advancedTexture", advancedTexture);
            // //Hide GUI in AR mode
            xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
                rectangle.isVisible = false;
            })
            xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
                rectangle.isVisible = true;

            })

            // //Get the Feature Manager and from it the HitTesting fearture and the xrcamera
            const fm = xr.baseExperience.featuresManager;
            const xrTest = fm.enableFeature(BABYLON.WebXRHitTest.Name, "latest");
            const xrCamera = xr.baseExperience.camera


            //Add glow layer, which will be used in the portal and the marker
            const gl = new BABYLON.GlowLayer("glow", scene, {
                mainTextureSamples: 4,
                mainTextureFixedSize: 256,
                blurKernelSize: 100
            });

            // //Create neonMaterial, which will be used in the portal
            const neonMaterial = new BABYLON.StandardMaterial("neonMaterial", scene);
            neonMaterial.emissiveColor = new BABYLON.Color3(0.35, 0.96, 0.88)

            //Create a marker that will be used to represent the hitTest position
            const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 }, scene);
            marker.isVisible = false;
            marker.rotationQuaternion = new BABYLON.Quaternion();
            gl.addIncludedOnlyMesh(marker);
            marker.material = neonMaterial;

            // //Update the position/rotation of the marker with HitTest information
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


            const virtualWorldResult = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/Kaustubh1504/crimeDoorArScenesTest/refs/heads/main/kala_brown.gltf", "", scene);
            // console.log(virtualWorldResult)

            const scaleFactor = 0.03;
            for (let child of virtualWorldResult.meshes) {
                child.renderingGroupId = 1;
                child.parent = rootScene;
                child.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
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

        const onRender = (scene) => {
            if (box !== undefined) {
                const deltaTimeInMillis = scene.getEngine().getDeltaTime();
                const rpm = 10;
                box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
            }
        };

        if (scene.isReady()) {
            onSceneReady(scene);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        }

        engine.runRenderLoop(() => {
            if (typeof onRender === "function") onRender(scene);
            scene.render();
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener("resize", resize);
        }

        return () => {
            scene.getEngine().dispose();

            if (window) {
                window.removeEventListener("resize", resize);
            }
        };
    }, []);

    return <canvas ref={reactCanvas} id="my-canvas" style={{ width: "100%", height: "100%" }} />;
};

export default App;
