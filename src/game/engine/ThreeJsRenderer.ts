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

    this.scene.add(
      lightsHelper.getObject(this.renderer.capabilities.maxTextures),
    );
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";

    window.addEventListener("resize", () => {
      const width = window.visualViewport?.width || window.innerWidth;
      const height = window.visualViewport?.height || window.innerHeight;

      this.renderer.setSize(width, height);
      this.labelRenderer.setSize(width, height);
    });

    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;

    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
    main.appendChild(this.renderer.domElement);
    main.appendChild(this.labelRenderer.domElement);
  }

  update(delta: number) {
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
