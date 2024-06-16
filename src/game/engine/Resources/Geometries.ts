import * as THREE from "three";

export const wallGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);

wallGeometry.attributes.uv.setXY(0, 0, 0.5);
wallGeometry.attributes.uv.setXY(1, 0.25, 0.5);
wallGeometry.attributes.uv.setXY(2, 0, 0);
wallGeometry.attributes.uv.setXY(3, 0.25, 0);

wallGeometry.attributes.uv.setXY(4, 0.25, 0.5);
wallGeometry.attributes.uv.setXY(5, 0.5, 0.5);
wallGeometry.attributes.uv.setXY(6, 0.25, 0);
wallGeometry.attributes.uv.setXY(7, 0.5, 0);

wallGeometry.attributes.uv.setXY(8, 0.5, 0.5);
wallGeometry.attributes.uv.setXY(9, 0.75, 0.5);
wallGeometry.attributes.uv.setXY(10, 0.5, 0);
wallGeometry.attributes.uv.setXY(11, 0.75, 0);

wallGeometry.attributes.uv.setXY(12, 0.75, 0.5);
wallGeometry.attributes.uv.setXY(13, 1, 0.5);
wallGeometry.attributes.uv.setXY(14, 0.75, 0);
wallGeometry.attributes.uv.setXY(15, 1, 0);

wallGeometry.attributes.uv.setXY(16, 0, 1);
wallGeometry.attributes.uv.setXY(17, 0.25, 1);
wallGeometry.attributes.uv.setXY(18, 0, 0.5);
wallGeometry.attributes.uv.setXY(19, 0.25, 0.5);

wallGeometry.attributes.uv.setXY(20, 0.25, 1);
wallGeometry.attributes.uv.setXY(21, 0.5, 1);
wallGeometry.attributes.uv.setXY(22, 0.25, 0.5);
wallGeometry.attributes.uv.setXY(23, 0.5, 0.5);

export const wallOutlineGeometry = new THREE.PlaneGeometry(0.34, 0.34);

wallOutlineGeometry.translate(0, 0, 0.15);
