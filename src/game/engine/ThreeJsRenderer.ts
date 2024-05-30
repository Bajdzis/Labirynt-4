import * as THREE from "three";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

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

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    main.appendChild(this.renderer.domElement);
    this.camera.position.z += 6;
  }

  render(scene: THREE.Scene) {
    this.renderer.render(scene, this.camera);
  }
}
