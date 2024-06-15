import * as THREE from "three";

export interface GroupOfParticles {
  state: "stop" | "active";
  colorStart: THREE.Color;
  colorStop: THREE.Color;
  maxLife: number;
  numberOfParticles: number;

  type:
    | {
        type: "rectangle";
        width: number;
        height: number;
        x: number;
        y: number;
      }
    | {
        type: "circle-center" | "circle";
        radius: number;
        x: number;
        y: number;
      };
}
