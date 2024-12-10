import { InstancedMesh, Mesh } from "three";
import { MyGame } from "./engine/MyGame";
import { resources } from "./engine/Resources/Resources";
import { ThreeJsRenderer } from "./engine/ThreeJsRenderer";
import { wallOutlineGeometry } from "./engine/Resources/Geometries";

declare global {
  interface Window {
    setProgressBar: (msg: string, value: number) => void;
    disposeProgressBar: () => void;
    showTextInsteadOfProgressBar: () => {
      playButton: HTMLButtonElement;
    };
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
          resources.data.materials.wall,
          1,
        ),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 90);
    const { playButton } = window.showTextInsteadOfProgressBar();

    let isRunning = false;

    const runMobile = async () => {
      window.removeEventListener("touchend", runMobile);

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
      if (isRunning) {
        return;
      }
      isRunning = true;
      playButton.removeEventListener("mouseup", run);
      window.disposeProgressBar();

      const game = new MyGame(renderer);

      game.run();
      resources.data.sounds.theme.play();
    };
    playButton.addEventListener("touchend", runMobile, {
      passive: true,
    });
    playButton.addEventListener("mouseup", run);
  });

function waitForEnd(callback: () => void) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      callback();
      requestAnimationFrame(resolve);
    });
  });
}
