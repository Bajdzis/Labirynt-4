import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { lightsHelper } from "./ThreeJsBoard/LightsHelper";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private perspectiveCamera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;
  private scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
    const main = document.getElementById("main");
    if (!main)
      throw new Error(`No element with id 'main' found in the document`);

    this.perspectiveCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

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
      this.perspectiveCamera.aspect = width / height;

      this.perspectiveCamera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.labelRenderer.setSize(width, height);
    });

    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;

    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
    main.appendChild(this.renderer.domElement);
    main.appendChild(this.labelRenderer.domElement);
    this.perspectiveCamera.position.z += 6;

    this.orbitControls = new OrbitControls(
      this.perspectiveCamera,
      this.renderer.domElement,
    );
  }

  update(delta: number) {
    this.orbitControls.update(delta);
  }

  render(
    object: THREE.Object3D,
    camera: THREE.Camera = this.perspectiveCamera,
  ) {
    this.scene.add(object);
    this.renderer.render(this.scene, camera);
    this.labelRenderer.render(this.scene, camera);
    this.scene.remove(object);
  }
}
