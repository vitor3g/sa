import * as THREE from "three";

export function wrapAndRepeatTexture(map: THREE.Texture) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.x = map.repeat.y = 10;
}

export const W = "w";
export const A = "a";
export const S = "s";
export const D = "d";
export const SHIFT = "shift";
export const DIRECTIONS = [W, A, S, D];

const vec3_4 = new THREE.Vector3();

const _calculateObjectSize = (object: THREE.Object3D) => {
  const bbox = new THREE.Box3();
  bbox.expandByObject(object);
  const size = bbox.getSize(vec3_4);

  return size;
};

export { _calculateObjectSize };
