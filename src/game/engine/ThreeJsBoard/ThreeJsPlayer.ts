import * as THREE from "three";
import { Player } from "../Board/Player";
import { random } from "../Utils/math/random";
import { Timer } from "../Board/Timer";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
export class ThreeJsPlayer extends Player implements ThreeJsBoardObject {
  private group: THREE.Group;

  private lightTimer: Timer;
  constructor(material: THREE.Material) {
    super();

    this.group = new THREE.Group();

    const body = this.createPlayerBody(material);
    const light = this.createPlayerLight();

    this.group.add(body);
    this.group.add(light);

    this.lightTimer = new Timer(150, () => {
      light.position.x = random(-0.01, 0.01);
      light.position.y = random(-0.01, 0.01);
      light.intensity = random(0.45, 0.55);
    });
  }

  getObject() {
    return this.group;
  }

  update(delta: number) {
    this.lightTimer.update(delta);
    this.group.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), this.angle);
    this.group.position.x = this.x;
    this.group.position.y = this.y;
  }

  createPlayerBody(material: THREE.Material) {
    const playerGeometry = new THREE.PlaneGeometry(this.width, this.height);

    const body = new THREE.Mesh(playerGeometry, material);
    body.position.z = 0.16;
    return body;
  }

  createPlayerLight() {
    const light = new THREE.PointLight("orange", 0.5, 0.32 * 4);
    light.position.z = 0.4;
    light.castShadow = true;

    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.01;
    light.shadow.camera.far = 0.32 * 3;

    return light;
  }
}
