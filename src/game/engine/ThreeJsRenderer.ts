import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { lightsHelper } from "./ThreeJsBoard/LightsHelper";
import { GameCamera } from "./GameCamera";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private perspectiveCamera: THREE.PerspectiveCamera | null = null;
  private orbitControls: OrbitControls | null = null;
  private scene: THREE.Scene;
  private gameCamera: GameCamera = new GameCamera();
  private scale = 1;

  constructor() {
    this.scene = new THREE.Scene();
    const main = document.getElementById("main");
    if (!main)
      throw new Error(`No element with id 'main' found in the document`);

    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      preserveDrawingBuffer: false,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.domElement.style.imageRendering = "pixelated";
    this.renderer.domElement.style.width = "100%";
    // this.scene.add(new THREE.AmbientLight());
    this.scene.add(
      lightsHelper.getObject(this.renderer.capabilities.maxTextures),
    );
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";

    window.addEventListener("resize", () => {
      this.refreshResolutionAndSetScale(this.scale);
    });

    this.refreshResolutionAndSetScale(this.scale);
    main.appendChild(this.renderer.domElement);
    main.appendChild(this.labelRenderer.domElement);
  }

  private refreshResolutionAndSetScale(scale: number) {
    this.scale = scale;

    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;

    this.renderer.setSize(width * this.scale, height * this.scale, false);
    this.labelRenderer.setSize(width, height);
  }

  private last15DeltaTime: number[] = [];
  update(delta: number) {
    this.last15DeltaTime.unshift(delta);
    if (this.last15DeltaTime.length > 15) {
      this.last15DeltaTime.pop();
      if (this.scale > 0.25) {
        if (this.last15DeltaTime.every((time) => time > 24)) {
          this.renderer.shadowMap.enabled = false;
          this.refreshResolutionAndSetScale(this.scale - 0.05);
          console.log("Scale down", this.scale);
          this.last15DeltaTime = [];
        }
      }
    }
    if (this.orbitControls) {
      this.orbitControls.update(delta);
    }
  }

  getGameCamera() {
    return this.gameCamera;
  }

  // private createPerspectiveCamera() {
  //   if (this.perspectiveCamera) {
  //     return this.perspectiveCamera;
  //   }

  //   const perspectiveCamera = new THREE.PerspectiveCamera(
  //     45,
  //     window.innerWidth / window.innerHeight,
  //     0.1,
  //     1000,
  //   );
  //   perspectiveCamera.position.z += 6;

  //   window.addEventListener("resize", () => {
  //     const width = window.visualViewport?.width || window.innerWidth;
  //     const height = window.visualViewport?.height || window.innerHeight;
  //     perspectiveCamera.aspect = width / height;

  //     perspectiveCamera.updateProjectionMatrix();
  //   });

  //   this.perspectiveCamera = perspectiveCamera;
  //   this.orbitControls = new OrbitControls(
  //     this.perspectiveCamera,
  //     this.renderer.domElement,
  //   );

  //   return perspectiveCamera;
  // }

  render(object: THREE.Object3D) {
    const camera: THREE.Camera = this.gameCamera.getCamera();
    // const camera: THREE.Camera = this.createPerspectiveCamera();
    this.scene.add(object);
    this.renderer.render(this.scene, camera);
    this.labelRenderer.render(this.scene, camera);
    this.scene.remove(object);
  }
}
