import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

export class ThreeJsRenderer {
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
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

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";

    window.addEventListener("resize", () => {
      const width = window.visualViewport?.width || window.innerWidth;
      const height = window.visualViewport?.height || window.innerHeight;
      this.perspectiveCamera.aspect = width / height;

      this.orthographicCamera.left = -width / 400;
      this.orthographicCamera.right = width / 400;
      this.orthographicCamera.top = height / 400;
      this.orthographicCamera.bottom = -height / 400;
      this.orthographicCamera.updateProjectionMatrix();

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

  render(scene: THREE.Scene) {
    this.renderer.render(scene, this.orthographicCamera);
    this.labelRenderer.render(scene, this.orthographicCamera);
  }
}
