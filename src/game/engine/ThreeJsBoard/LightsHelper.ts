import * as THREE from "three";

class LightsHelper {
  private group = new THREE.Group();
  private pointLights: THREE.PointLight[] = [];
  constructor() {
    this.createLights(8);
  }

  createLights(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const light = new THREE.PointLight("white", 0, 0);
      light.castShadow = true;

      light.shadow.mapSize.width = 128;
      light.shadow.mapSize.height = 128;
      this.pointLights.push(light);
      this.group.add(light);
    }
  }

  getObject() {
    return this.group;
  }

  getPointLight(
    color: THREE.ColorRepresentation = "white",
    intensity: number = 1,
    distance: number = 1,
  ): THREE.PointLight {
    const light = this.pointLights.find((light) => light.intensity === 0);
    if (light) {
      light.color.set(color);
      light.intensity = intensity;
      light.distance = distance;
      return light;
    }
    this.createLights(4);
    return this.getPointLight(color, intensity, distance);
  }
}

export const lightsHelper = new LightsHelper();
