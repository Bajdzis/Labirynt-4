import * as THREE from "three";

export class GameCamera {
  private orthographicCamera: THREE.OrthographicCamera;
  constructor() {
    const position = this.getViewportMinimalSize();
    this.orthographicCamera = new THREE.OrthographicCamera(
      position.min.x,
      position.max.x,
      position.max.y,
      position.min.y,
      -10,
      10,
    );

    window.addEventListener("resize", () => {
      const position = this.getViewportMinimalSize();

      this.orthographicCamera.left = position.min.x;
      this.orthographicCamera.right = position.max.x;
      this.orthographicCamera.top = position.max.y;
      this.orthographicCamera.bottom = position.min.y;
      this.orthographicCamera.updateProjectionMatrix();
    });
  }

  getViewportSize() {
    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;

    return { width, height };
  }

  getCurrentPosition() {
    return new THREE.Box2(
      new THREE.Vector2(
        this.orthographicCamera.left,
        this.orthographicCamera.bottom,
      ),
      new THREE.Vector2(
        this.orthographicCamera.right,
        this.orthographicCamera.top,
      ),
    );
  }

  getViewportMinimalSize() {
    const { width, height } = this.getViewportSize();

    return new THREE.Box2(
      new THREE.Vector2(-width * 0.005, -height * 0.005),
      new THREE.Vector2(width * 0.005, height * 0.005),
    );
  }

  setAreasToShow(areas: THREE.Box2[]) {
    const wholeArea = new THREE.Box2(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 0),
    );

    areas.forEach((area) => {
      wholeArea.expandByPoint(area.min);
      wholeArea.expandByPoint(area.max);
    });

    const center = wholeArea.getCenter(new THREE.Vector2());

    const newPosition = this.getViewportMinimalSize()
      .translate(center)
      .expandByPoint(wholeArea.min)
      .expandByPoint(wholeArea.max);

    // fix aspect ratio
    const aspect = window.innerWidth / window.innerHeight;
    const width = newPosition.max.x - newPosition.min.x;
    const height = newPosition.max.y - newPosition.min.y;
    if (width / height > aspect) {
      const diff = (width / aspect - height) / 2;
      newPosition.min.y -= diff;
      newPosition.max.y += diff;
    } else {
      const diff = (height * aspect - width) / 2;
      newPosition.min.x -= diff;
      newPosition.max.x += diff;
    }

    this.orthographicCamera.left = newPosition.min.x;
    this.orthographicCamera.right = newPosition.max.x;
    this.orthographicCamera.top = newPosition.max.y;
    this.orthographicCamera.bottom = newPosition.min.y;
    this.orthographicCamera.updateProjectionMatrix();
  }

  getCamera() {
    return this.orthographicCamera;
  }
}
