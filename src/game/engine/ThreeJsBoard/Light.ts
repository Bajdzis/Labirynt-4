import * as THREE from "three";
import { random } from "../Utils/math/random";
import { Timer } from "../Board/Timer";
import { lightsHelper } from "./LightsHelper";

export class Light {
  private light: THREE.PointLight;

  private lightTimer: Timer;
  constructor(size: number) {
    this.light = this.createLight(size);

    this.lightTimer = new Timer(150, () => {
      this.light.position.x = random(-0.01, 0.01);
      this.light.position.y = random(-0.01, 0.01);
      this.light.intensity = random(0.45, 0.55);
    });
  }

  getObject() {
    return this.light;
  }

  update(delta: number) {
    this.lightTimer.update(delta);
  }

  createLight(size: number) {
    const light = lightsHelper.getPointLight("orange", 0.5, 0.32 * size);
    light.position.z = 0.4;

    light.shadow.camera.near = 0.01;
    light.shadow.camera.far = 0.32 * size - 1;

    return light;
  }

  changeLightColor(color: string, intensity: number = 0.5) {
    this.light.color.set(color);
    this.light.intensity = intensity;
  }

  changeLightSize(size: number) {
    this.light.distance = 0.32 * size;
    this.light.shadow.camera.far = 0.32 * size - 1;
  }
}
