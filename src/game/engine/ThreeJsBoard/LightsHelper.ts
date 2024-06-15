import * as THREE from "three";

class LightsHelper {
  private group = new THREE.Group();
  private pointLights: THREE.PointLight[] = [];
  constructor() {
    this.createLights(4);
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
    decay: number = 2,
  ): THREE.PointLight {
    const light = this.pointLights.find((light) => light.intensity === 0);
    if (light) {
      light.color.set(color);
      light.intensity = intensity;
      light.distance = distance;
      light.decay = decay;
      return light;
    }
    this.createLights(4);
    return this.getPointLight(color, intensity, distance, decay);
  }

  hidePointLight(light: THREE.PointLight) {
    light.intensity = 0;
    light.parent?.remove(light);
    this.pointLights = this.pointLights.filter((l) => l !== light);
    light.dispose();
    this.createLights(1);
  }
}

export const lightsHelper = new LightsHelper();
