import * as THREE from "three";

class LightsHelper {
  private group = new THREE.Group();
  private pointLights: THREE.PointLight[] = [];
  constructor() {}

  createLights(quantity: number, castShadow = false) {
    for (let i = 0; i < quantity; i++) {
      const light = new THREE.PointLight("white", 0, 0);
      if (castShadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = 128;
        light.shadow.mapSize.height = 128;
        light.shadow.autoUpdate = false;
        light.shadow.needsUpdate = true;
      }
      this.pointLights.push(light);
      this.group.add(light);
    }
  }

  getObject(maxTexturesCapabilities: number) {
    if (this.pointLights.length === 0) {
      this.createLights(
        Math.min(Math.floor(maxTexturesCapabilities / 2), 4),
        true,
      );
      this.createLights(8, false);
    }

    return this.group;
  }

  getPointLightWithShadow(
    color: THREE.ColorRepresentation = "white",
    intensity: number = 1,
    distance: number = 1,
    decay: number = 2,
  ): THREE.PointLight {
    const light = this.pointLights.find(
      (light) => light.intensity === 0 && light.castShadow,
    );
    if (light) {
      light.color.set(color);
      light.intensity = intensity;
      light.distance = distance;
      light.decay = decay;
      return light;
    }

    return this.getPointLightWithoutShadow(color, intensity, distance, decay);
  }

  getPointLightWithoutShadow(
    color: THREE.ColorRepresentation = "white",
    intensity: number = 1,
    distance: number = 1,
    decay: number = 2,
  ): THREE.PointLight {
    const light = this.pointLights.find(
      (light) => light.intensity === 0 && light.castShadow === false,
    );
    if (light) {
      light.color.set(color);
      light.intensity = intensity;
      light.distance = distance;
      light.decay = decay;
      return light;
    }
    this.createLights(4);
    return this.getPointLightWithoutShadow(color, intensity, distance, decay);
  }

  hidePointLight(light: THREE.PointLight) {
    light.intensity = 0;
    light.parent?.remove(light);
    this.pointLights = this.pointLights.filter((l) => l !== light);
    light.dispose();
    this.createLights(1, light.castShadow);
  }
}

export const lightsHelper = new LightsHelper();
