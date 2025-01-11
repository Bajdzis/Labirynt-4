import * as THREE from "three";
import { Player } from "../Board/Player";
import { Light } from "./Light";
import { resources } from "../Resources/Resources";
import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { KeyboardMovement } from "../IO/Behaviors/KeyboardMovement";
import { KeyboardPressButton } from "../IO/Behaviors/KeyboardPressButton";
import { MobileGamePadMovement } from "../IO/Behaviors/MobileGamePadMovement";
import { MobileGamepadPressButton } from "../IO/Behaviors/MobileGamepadPressButton";
import { GamepadAxisBehavior } from "../IO/Behaviors/GamepadAxisBehavior";
import { gamepad0, gamepad1 } from "../IO/Devices/Gamepad";
import { GamepadPressButton } from "../IO/Behaviors/GamepadPressButton";
import { MouseAxisFromCenterScreenBehavior } from "../IO/Behaviors/MouseAxisFromCenterScreenBehavior";
import { MousePressButton } from "../IO/Behaviors/MousePressButton";

const ROTATION_VECTOR = new THREE.Vector3(0, 0, 1);

export class ThreeJsPlayer extends Player {
  private group: THREE.Group;

  private light: Light;
  constructor(
    private material: THREE.Material,
    moveBehavior: ControlBehavior<{ x: number; y: number }>,
    actionBehavior: ControlBehavior<true>,
  ) {
    super(moveBehavior, actionBehavior);

    this.group = new THREE.Group();

    this.light = this.generatePlayerBody();
  }

  private generatePlayerBody() {
    const body = this.createPlayerBody(this.material);

    this.group.add(body);

    const light = new Light(this.numberOfTorches * 2 + 1.5);
    const obj = light.getObject();
    obj.position.x = 0.1;
    obj.position.y = 0.1;
    this.group.add(obj);

    return light;
  }

  setPosition(x: number, y: number) {
    super.setPosition(x, y);
    this.light.updateShadow();
  }

  changePosition(x: number, y: number) {
    super.changePosition(x, y);
    this.light.updateShadow();
  }

  getObject() {
    return this.group;
  }

  kill(): void {
    if (this.isDead) {
      return;
    }
    super.kill();

    this.light.remove();
    this.group.clear();
    const playerGeometry = new THREE.PlaneGeometry(0.32, 0.32);

    const body = new THREE.Mesh(
      playerGeometry,
      resources.data.materials.playerDead,
    );
    body.position.z = 0.16;
    this.group.add(body);
  }

  resetKillStatus() {
    if (this.isDead) {
      this.numberOfTorches = 2;
      this.light.remove();
      this.group.clear();
      this.light = this.generatePlayerBody();
      this.isDead = false;
    }
  }

  update(delta: number) {
    if (this.isDead) {
      return;
    }
    super.update(delta);
    if (this.numberOfTorches !== 0) {
      this.light.update(delta);
    }
    this.group.setRotationFromAxisAngle(ROTATION_VECTOR, this.angle);
    this.group.position.x = this.x - 0.05;
    this.group.position.y = this.y - 0.05;
  }

  grabTorch() {
    super.grabTorch();
    this.updatePlayerLight();
  }

  throwTorch() {
    super.throwTorch();
    this.updatePlayerLight();
  }

  updatePlayerLight() {
    this.light.changeLightSize(this.numberOfTorches * 2 + 1.5);
    this.light.changeLightColor(
      this.numberOfTorches === 0 ? "#ccc" : "orange",
      this.numberOfTorches === 0 ? 0.15 : 0.5,
    );
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
      new GamepadAxisBehavior(gamepad0, "left"),
      new MouseAxisFromCenterScreenBehavior(),
    ]);

    const actionBehavior = new ControlBehavior([
      new KeyboardPressButton("KeyE"),
      new MobileGamepadPressButton(),
      new GamepadPressButton(gamepad0, "PsCrossButton"),
      new MousePressButton("rightButton"),
    ]);

    super(resources.data.materials.player1, moveBehavior, actionBehavior);
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
      new GamepadAxisBehavior(gamepad1, "left"),
    ]);

    const actionBehavior = new ControlBehavior([
      new KeyboardPressButton("Numpad0"),
      new GamepadPressButton(gamepad1, "PsCrossButton"),
    ]);

    super(resources.data.materials.player2, moveBehavior, actionBehavior);
  }
}
