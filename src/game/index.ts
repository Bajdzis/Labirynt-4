import { Mesh, PlaneGeometry } from "three";
import { MyGame } from "./engine/MyGame";
import { Resources } from "./engine/Resources/Resources";
import { ThreeJsRenderer } from "./engine/ThreeJsRenderer";

declare global {
  interface Window {
    setProgressBar: (msg: string, value: number) => void;
    disposeProgressBar: () => void;
  }
}

window.setProgressBar("Przetwarzanie zasobów...", 2);

const resources = new Resources();

resources
  .prepareAllResources((progress) => {
    window.setProgressBar("Przetwarzanie zasobów...", progress * 50);
  })
  .then(async () => {
    const renderer = new ThreeJsRenderer();
    window.setProgressBar("Kompilowanie shaderów...", 50);

    await waitForEnd(() => {
      renderer.render(
        new Mesh(new PlaneGeometry(1, 1), resources.material.player1),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 60);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(new PlaneGeometry(1, 1), resources.material.floor),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 70);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(new PlaneGeometry(1, 1), resources.material.floorShadow),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 80);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(new PlaneGeometry(1, 1), resources.material.wall),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 90);
    await waitForEnd(() => {
      const game = new MyGame(resources, renderer);

      game.run();
    });
    window.disposeProgressBar();
  });

function waitForEnd(callback: () => void) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      callback();
      requestAnimationFrame(resolve);
    });
  });
}
