import * as THREE from "three";
import { Particles } from "./Particles";

export const boxParticles = new Particles(
  new THREE.BoxGeometry(0.02, 0.02, 0.02),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }),
);
