import * as THREE from "three";

export class ThreeJsBoard {
  private scene: THREE.Scene;
  private player: THREE.Mesh;

  private wallGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  private wallMaterial = new THREE.MeshBasicMaterial({ color: "red" });

  constructor() {
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const materialYellow = new THREE.MeshBasicMaterial({ color: "yellow" });

    this.player = new THREE.Mesh(geometry, materialYellow);

    this.scene.add(this.player);

    this.addWall(3, 2);
    this.addWall(3, 2);
    this.addWall(2, 2);
    this.addWall(1, 2);
    this.addWall(0, 2);
    this.addWall(-1, 2);
    this.addWall(-1, 1);
    this.addWall(-1, 0);
    this.addWall(1, 0);
    this.addWall(2, 0);
    this.addWall(3, 0);
    this.addWall(3, 1);
  }

  changePlayerPosition(x: number, y: number) {
    this.player.position.x += x;
    this.player.position.y += y;
  }

  getScene() {
    return this.scene;
  }

  addWall(x: number, y: number) {
    const cube = new THREE.Mesh(this.wallGeometry, this.wallMaterial);

    cube.position.x = x * 0.32;
    cube.position.y = y * 0.32;
    cube.position.z = 0.16;
    this.scene.add(cube);
  }
}
