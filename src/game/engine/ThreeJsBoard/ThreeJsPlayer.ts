import * as THREE from "three";
import { Player, PlayerKeys } from "../Board/Player";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Light } from "./Light";

export class ThreeJsPlayer extends Player implements ThreeJsBoardObject {
  private group: THREE.Group;

  private light: Light;
  constructor(
    material: THREE.Material,
    keyCodes: PlayerKeys,
    useTouchScreen: boolean = false,
  ) {
    super(keyCodes, useTouchScreen);

    this.group = new THREE.Group();

    const body = this.createPlayerBody(material);

    this.group.add(body);
    // const element = document.createElement("div");
    // element.className = "label";
    // element.innerHTML = "Jakis tekst";
    // const elementCss2D = new CSS2DObject(element);
    // this.group.add(elementCss2D);

    this.light = new Light(this.numberOfTorches * 2 + 1.5);
    const obj = this.light.getObject();
    obj.position.x = 0.1;
    obj.position.y = 0.1;
    this.group.add(obj);
  }

  getObject() {
    return this.group;
  }

  update(delta: number) {
    super.update(delta);
    if (this.numberOfTorches !== 0) {
      this.light.update(delta);
    }
    this.light.changeLightSize(this.numberOfTorches * 2 + 1.5);
    this.light.changeLightColor(
      this.numberOfTorches === 0 ? "#ccc" : "orange",
      this.numberOfTorches === 0 ? 0.15 : 0.5,
    );
    this.group.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), this.angle);
    this.group.position.x = this.x - 0.05;
    this.group.position.y = this.y - 0.05;
  }

  createPlayerBody(material: THREE.Material) {
    const playerGeometry = new THREE.PlaneGeometry(this.width, this.height);

    const body = new THREE.Mesh(playerGeometry, material);
    body.position.z = 0.16;
    return body;
  }
}
