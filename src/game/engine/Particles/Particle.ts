import * as THREE from "three";

export class Particle {
  position: THREE.Vector3;
  matrix: THREE.Matrix4;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  colorStart: THREE.Color;
  colorStop: THREE.Color;
  rotation: THREE.Euler;

  constructor(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    life: number,
    colorStart: THREE.Color,
    colorStop: THREE.Color,
  ) {
    this.position = position;
    this.matrix = new THREE.Matrix4();
    this.matrix.setPosition(this.position);
    this.velocity = velocity;
    this.life = Math.random() * life;
    this.maxLife = life;
    this.colorStart = colorStart;
    this.colorStop = colorStop;
    this.rotation = new THREE.Euler();
    this.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );
  }

  getColor() {
    return this.colorStart
      .clone()
      .lerp(this.colorStop, this.life / this.maxLife);
  }

  setNewPosition(position: THREE.Vector3, maxLife: number) {
    this.position = position;
    this.matrix.setPosition(this.position);
    this.life = Math.random() * maxLife;
    this.maxLife = maxLife;
    this.matrix.makeScale(1, 1, 1);
  }

  update(delta: number) {
    this.position.add(this.velocity.clone().multiplyScalar(delta));
    this.matrix.makeRotationFromEuler(this.rotation);
    this.rotation.x += 0.001 * delta;
    this.rotation.y += 0.001 * delta;
    this.rotation.z += 0.001 * delta;

    this.matrix.setPosition(this.position);
    this.life -= delta;
    if (this.life < 0) {
      this.matrix.makeScale(0, 0, 0);
    } else {
      this.matrix.scale(
        new THREE.Vector3(
          this.life / this.maxLife,
          this.life / this.maxLife,
          this.life / this.maxLife,
        ),
      );
    }
  }
}
