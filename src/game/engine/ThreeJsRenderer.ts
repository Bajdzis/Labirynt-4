import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private perspectiveCamera: THREE.PerspectiveCamera;
  private orthographicCamera: THREE.OrthographicCamera;
  private orbitControls: OrbitControls;

  constructor() {
    const main = document.getElementById("main");
    if (!main)
      throw new Error(`No element with id 'main' found in the document`);

    this.perspectiveCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.orthographicCamera = new THREE.OrthographicCamera(
      -window.innerWidth / 400,
      window.innerWidth / 400,
      window.innerHeight / 400,
      -window.innerHeight / 400,
      -1,
      1,
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;

    window.addEventListener("resize", () => {
      this.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;

      this.orthographicCamera.left = -window.innerWidth / 400;
      this.orthographicCamera.right = window.innerWidth / 400;
      this.orthographicCamera.top = window.innerHeight / 400;
      this.orthographicCamera.bottom = -window.innerHeight / 400;
      this.orthographicCamera.updateProjectionMatrix();

      this.perspectiveCamera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    main.appendChild(this.renderer.domElement);
    this.perspectiveCamera.position.z += 6;

    this.orbitControls = new OrbitControls(
      this.perspectiveCamera,
      this.renderer.domElement,
    );
  }

  update(delta: number) {
    this.orbitControls.update(delta);
  }

  render(scene: THREE.Scene) {
    this.renderer.render(scene, this.orthographicCamera);
  }
}
