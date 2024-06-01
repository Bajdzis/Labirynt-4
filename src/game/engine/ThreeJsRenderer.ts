import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;

  constructor() {
    const main = document.getElementById("main");
    if (!main)
      throw new Error(`No element with id 'main' found in the document`);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    main.appendChild(this.renderer.domElement);
    this.camera.position.z += 6;

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
  }

  update(delta: number) {
    this.orbitControls.update(delta);
  }

  render(scene: THREE.Scene) {
    this.renderer.render(scene, this.camera);
  }
}
