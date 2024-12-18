import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";
import { WayPoint } from "./WayPoint";

export class WayNetworkView {
  private activeMaterial = new MeshBasicMaterial({ color: "red" });
  private inactiveMaterial = new MeshBasicMaterial({ color: "black" });
  private pathMaterial = new MeshBasicMaterial({ color: "blue" });

  private geometry = new BoxGeometry(0.05, 0.05, 0.05);
  private group = new Group();

  private waypointMeshes = new Map<WayPoint, Mesh>();
  private showingPath: WayPoint[] = [];
  constructor(private waypoints: WayPoint[]) {
    for (const waypoint of this.waypoints) {
      const mesh = new Mesh(
        this.geometry,
        waypoint.isActive() ? this.activeMaterial : this.inactiveMaterial,
      );
      mesh.position.set(
        waypoint.x * 0.32, // + 0.16,
        waypoint.y * 0.32, // + 0.16,
        0.5,
      );

      this.waypointMeshes.set(waypoint, mesh);
      this.group.add(mesh);
    }
  }

  showPath(path: WayPoint[]) {
    this.showingPath = path;
  }

  update() {
    for (const [waypoint, mesh] of this.waypointMeshes) {
      mesh.material = this.showingPath.includes(waypoint)
        ? this.pathMaterial
        : waypoint.isActive()
          ? this.activeMaterial
          : this.inactiveMaterial;
    }
  }
  getObject() {
    return this.group;
  }
}
