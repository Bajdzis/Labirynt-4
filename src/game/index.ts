import { InstancedMesh, Mesh } from "three";
import { MyGame } from "./engine/MyGame";
import { resources } from "./engine/Resources/Resources";
import { ThreeJsRenderer } from "./engine/ThreeJsRenderer";
import { wallOutlineGeometry } from "./engine/Resources/Geometries";
import { ControlBehavior } from "./engine/IO/Behaviors/ControlBehavior";
import { KeyboardPressButton } from "./engine/IO/Behaviors/KeyboardPressButton";
import { GamepadPressButton } from "./engine/IO/Behaviors/GamepadPressButton";
import {
  gamepad0,
  gamepad1,
  updateGamepads,
} from "./engine/IO/Devices/Gamepad";
import { MouseClickElement } from "./engine/IO/Behaviors/MouseClickElement";
import { lightsHelper } from "./engine/ThreeJsBoard/LightsHelper";

declare global {
  interface Window {
    setProgressBar: (msg: string, value: number) => void;
    disposeProgressBar: () => void;
    showTextInsteadOfProgressBar: () => HTMLButtonElement | null;
  }
}

window.setProgressBar("Pobieranie zasobów...", 2);

resources
  .prepareAllResources((progress) => {
    window.setProgressBar("Pobieranie zasobów...", progress * 50);
  })
  .then(async () => {
    const renderer = new ThreeJsRenderer();

    window.setProgressBar("Kompilowanie shaderów...", 50);
    const tempLight = lightsHelper.getPointLightWithShadow(
      "orange",
      0.5,
      0.32 * 1,
    );
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.player1),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 60);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.floor),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 70);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.floorShadow),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 75);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.torch),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 80);
    await waitForEnd(() => {
      renderer.render(
        new InstancedMesh(
          wallOutlineGeometry,
          resources.data.materials.player1,
          1,
        ),
      );
    });
    lightsHelper.hidePointLight(tempLight);
    window.setProgressBar("Kompilowanie shaderów...", 85);
    await waitForEnd(() => {
      renderer.render(
        new InstancedMesh(
          wallOutlineGeometry,
          resources.data.materials.wall,
          1,
        ),
      );
    });
    window.setProgressBar("Kompilowanie shaderów...", 90);

    let playButton = window.showTextInsteadOfProgressBar();

    let isGameRunning = false;
    const startPlayBehavior = new ControlBehavior([
      new KeyboardPressButton("Enter"),
      new MouseClickElement(playButton || document.body),
      new GamepadPressButton(gamepad0, "PsCrossButton"),
      new GamepadPressButton(gamepad1, "PsCrossButton"),
    ]);
    let lastTime: number = 0;
    function behaviorLoop(time: DOMHighResTimeStamp) {
      updateGamepads();
      const delta = time - lastTime;
      lastTime = time;
      startPlayBehavior.update(delta);

      const shouldStart = startPlayBehavior.getState();
      if (shouldStart) {
        run();
      } else if (!isGameRunning) {
        window.requestAnimationFrame(behaviorLoop);
      }
    }

    behaviorLoop(lastTime);

    const runMobile = async () => {
      try {
        await document.documentElement.requestFullscreen();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (screen.orientation.lock) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          screen.orientation.lock("landscape");
        }
      } catch (error) {
        console.warn(error);
      }

      run();
    };

    const run = async () => {
      if (isGameRunning) {
        return;
      }

      playButton && playButton.removeEventListener("touchend", runMobile);
      playButton = null;
      isGameRunning = true;
      window.disposeProgressBar();

      const game = new MyGame(renderer);

      game.run();
      resources.data.sounds.theme.play();
    };
    playButton &&
      playButton.addEventListener("touchend", runMobile, {
        passive: true,
      });
  });

function waitForEnd(callback: () => void) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      callback();
      requestAnimationFrame(resolve);
    });
  });
}
