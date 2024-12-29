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
  private showingPathOpacity: Map<WayPoint, number> = new Map();
  private waypoints: WayPoint[] = [];

  setWaypoints(waypoints: WayPoint[]) {
    this.waypoints = waypoints;
    this.group.clear();
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

  showValues(values: { wp: WayPoint; value: number }[]) {
    const minValue = Math.min(...values.map((v) => v.value));
    const maxValue = Math.max(...values.map((v) => v.value));
    this.showingPathOpacity.clear();
    values.forEach((v) => {
      const opacity = (v.value + minValue) / (maxValue + minValue);
      this.showingPathOpacity.set(v.wp, opacity);
      return { wp: v.wp, opacity };
    });
  }

  update() {
    for (const [waypoint, mesh] of this.waypointMeshes) {
      const value = this.showingPathOpacity.get(waypoint);
      if (value) {
        mesh.material = new MeshBasicMaterial({
          color: "green",
          opacity: value,
          transparent: true,
        });
        continue;
      }
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
