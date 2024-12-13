import * as THREE from "three";

export class Particle {
  position: THREE.Vector3;
  matrix: THREE.Matrix4;
  velocity: THREE.Vector3;
  scale: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  colorStart: THREE.Color;
  colorStop: THREE.Color;
  rotation: THREE.Euler;

  constructor(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    maxLife: number,
    colorStart: THREE.Color,
    colorStop: THREE.Color,
  ) {
    this.position = position;
    this.matrix = new THREE.Matrix4();
    this.matrix.setPosition(this.position);
    this.velocity = velocity;
    this.life = Math.random() * maxLife;
    this.maxLife = maxLife;
    this.colorStart = colorStart;
    this.colorStop = colorStop;
    this.color = new THREE.Color(colorStart.r, colorStart.g, colorStart.b);
    this.rotation = new THREE.Euler();
    this.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );
    this.scale = new THREE.Vector3(1, 1, 1);
  }

  setNewPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.matrix.setPosition(this.position);
    this.life = Math.random() * this.maxLife;
    this.matrix.makeScale(1, 1, 1);
  }

  update(delta: number) {
    this.position.set(
      this.position.x + this.velocity.x * delta,
      this.position.y + this.velocity.y * delta,
      this.position.z + this.velocity.z * delta,
    );

    this.rotation.x += 0.001 * delta;
    this.rotation.y += 0.001 * delta;
    this.rotation.z += 0.001 * delta;
    this.matrix.makeRotationFromEuler(this.rotation);

    this.matrix.setPosition(this.position);
    this.life -= delta;

    const scaleValue = Math.max(0, this.life / this.maxLife);
    this.scale.set(scaleValue, scaleValue, scaleValue);
    this.matrix.scale(this.scale);

    this.color
      .set(this.colorStart)
      .lerp(this.colorStop, this.life / this.maxLife);
  }
}
