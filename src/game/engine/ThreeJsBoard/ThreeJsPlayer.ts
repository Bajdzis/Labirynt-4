import * as THREE from "three";
import { Player } from "../Board/Player";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Light } from "./Light";
import { resources } from "../Resources/Resources";
import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { KeyboardMovement } from "../IO/Behaviors/KeyboardMovement";
import { KeyboardPressButton } from "../IO/Behaviors/KeyboardPressButton";
import { MobileGamePadMovement } from "../IO/Behaviors/MobileGamePadMovement";
import { MobileGamepadPressButton } from "../IO/Behaviors/MobileGamepadPressButton";

export abstract class ThreeJsPlayer
  extends Player
  implements ThreeJsBoardObject
{
  private group: THREE.Group;

  private light: Light;
  constructor(
    material: THREE.Material,
    moveBehavior: ControlBehavior<{ x: number; y: number }>,
    actionBehavior: ControlBehavior<true>,
  ) {
    super(moveBehavior, actionBehavior);

    this.group = new THREE.Group();

    const body = this.createPlayerBody(material);

    this.group.add(body);

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

export class FirstPlayerPrototype extends ThreeJsPlayer {
  constructor() {
    const moveBehavior = new ControlBehavior([
      new KeyboardMovement({
        top: "KeyW",
        left: "KeyA",
        bottom: "KeyS",
        right: "KeyD",
      }),
      new MobileGamePadMovement(),
    ]);

    const actionBehavior = new ControlBehavior([
      new KeyboardPressButton("KeyE"),
      new MobileGamepadPressButton(),
    ]);

    super(resources.material.player1, moveBehavior, actionBehavior);
  }
}

export class SecondPlayerPrototype extends ThreeJsPlayer {
  constructor() {
    const moveBehavior = new ControlBehavior([
      new KeyboardMovement({
        top: "ArrowUp",
        left: "ArrowLeft",
        bottom: "ArrowDown",
        right: "ArrowRight",
      }),
    ]);

    const actionBehavior = new ControlBehavior([
      new KeyboardPressButton("Numpad0"),
    ]);

    super(resources.material.player2, moveBehavior, actionBehavior);
  }
}
