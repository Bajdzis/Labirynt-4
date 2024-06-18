import { InstancedMesh, Mesh } from "three";
import { MyGame } from "./engine/MyGame";
import { resources } from "./engine/Resources/Resources";
import { ThreeJsRenderer } from "./engine/ThreeJsRenderer";
import { wallOutlineGeometry } from "./engine/Resources/Geometries";

declare global {
  interface Window {
    setProgressBar: (msg: string, value: number) => void;
    disposeProgressBar: () => void;
  }
}

window.setProgressBar("Przetwarzanie zasobów...", 2);

resources
  .prepareAllResources((progress) => {
    window.setProgressBar("Przetwarzanie zasobów...", progress * 50);
  })
  .then(async () => {
    const renderer = new ThreeJsRenderer();
    window.setProgressBar("Kompilowanie shaderów...", 50);

    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.material.player1),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 60);
    await waitForEnd(() => {
      renderer.render(new Mesh(wallOutlineGeometry, resources.material.floor));
    });

    window.setProgressBar("Kompilowanie shaderów...", 70);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.material.floorShadow),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 80);
    await waitForEnd(() => {
      renderer.render(
        new InstancedMesh(wallOutlineGeometry, resources.material.wall, 1),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 90);
    await waitForEnd(() => {
      const game = new MyGame(renderer);

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
