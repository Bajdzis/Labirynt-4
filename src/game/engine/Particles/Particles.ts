import * as THREE from "three";
import { random } from "../Utils/math/random";
import { GroupOfParticles } from "./domain";
import { Particle } from "./Particle";

export class Particles {
  particleGeometry: THREE.BufferGeometry;
  particleMaterial: THREE.Material;
  instancedMesh: THREE.InstancedMesh;
  groupOfParticles: (GroupOfParticles & {
    particles: Particle[];
  })[];

  constructor(
    particleGeometry: THREE.BufferGeometry,
    particleMaterial: THREE.Material,
  ) {
    this.groupOfParticles = [];

    this.particleGeometry = particleGeometry;
    this.particleMaterial = particleMaterial;
    this.instancedMesh = new THREE.InstancedMesh(
      this.particleGeometry,
      this.particleMaterial,
      0,
    );
  }

  addGroupOfParticles(groupOfParticles: GroupOfParticles) {
    const particles = [];
    for (let i = 0; i < groupOfParticles.numberOfParticles; i++) {
      const life = groupOfParticles.maxLife;
      const colorStart = groupOfParticles.colorStart;
      const colorStop = groupOfParticles.colorStop;
      const velocity = new THREE.Vector3(0, 0, 0.15 / life);
      particles.push(
        new Particle(
          this.getNewPosition(groupOfParticles.type),
          velocity,
          life,
          colorStart,
          colorStop,
        ),
      );
    }
    const groupWithParticles = { ...groupOfParticles, particles };
    this.groupOfParticles.push(groupWithParticles);
    this.updateInstancedMesh();

    return () => {
      if (groupWithParticles.state === "stop") {
        return;
      }
      groupWithParticles.state = "stop";

      setTimeout(() => {
        this.groupOfParticles = this.groupOfParticles.filter(
          (group) => group !== groupWithParticles,
        );
        this.updateInstancedMesh();
      }, groupWithParticles.maxLife);
    };
  }

  private updateInstancedMesh() {
    const parent = this.instancedMesh.parent;
    if (parent) {
      parent.remove(this.instancedMesh);
    }
    this.instancedMesh = new THREE.InstancedMesh(
      this.particleGeometry,
      this.particleMaterial,
      this.getTotalNumberOfParticles(),
    );
    this.instancedMesh.frustumCulled = false;
    if (parent) {
      parent.add(this.instancedMesh);
    }
  }

  getTotalNumberOfParticles() {
    return this.groupOfParticles.reduce(
      (acc, group) => acc + group.numberOfParticles,
      0,
    );
  }

  getNewPosition(type: GroupOfParticles["type"]) {
    if (type.type === "circle-center") {
      const angle = random(0, Math.PI * 2);
      const radius = random(0, type.radius);
      return new THREE.Vector3(
        Math.cos(angle) * radius + type.x,
        Math.sin(angle) * radius + type.y,
        0.02,
      );
    } else if (type.type === "circle") {
      const r = type.radius * Math.sqrt(Math.random());
      const theta = random(0, Math.PI * 2);
      return new THREE.Vector3(
        r * Math.cos(theta) + type.x,
        r * Math.sin(theta) + type.y,
        0.02,
      );
    } else if (type.type === "rectangle") {
      return new THREE.Vector3(
        random(-type.width, type.width) + type.x,
        random(-type.height, type.height) + type.y,
        0.02,
      );
    }

    return new THREE.Vector3();
  }

  update(delta: number) {
    let i = 0;
    this.groupOfParticles.forEach(({ particles, type, maxLife, state }) => {
      particles.forEach((particle) => {
        particle.update(delta);
        this.instancedMesh.setMatrixAt(i, particle.matrix);
        this.instancedMesh.setColorAt(i, particle.getColor());
        if (particle.life < 0 && state === "active") {
          particle.setNewPosition(this.getNewPosition(type), maxLife);
        }
        i++;
      });
    });

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  getObject() {
    return this.instancedMesh;
  }

  dispose() {
    this.instancedMesh.parent?.remove(this.instancedMesh);
  }
}
