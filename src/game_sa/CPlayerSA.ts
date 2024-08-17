import { CCore } from "@/app/CCore";
import { CGameSA } from "./CGameSA";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";
import { CPlayerController } from "./CPlayerController";

const clock = new THREE.Clock();

class CPlayerSA {
  private controller: CPlayerController | undefined;
  private keysPressed: any = {};

  constructor(private readonly g_core: CCore, private g_gamesa: CGameSA) {
    const self = this;
    new GLTFLoader().load("./models/ArmyFinal.glb", function (gltf: any) {
      const model = gltf.scene;

      model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
      });

      self.g_core.getRenderer().GetScene().add(model);

      const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap: Map<string, THREE.AnimationAction> = new Map();

      gltfAnimations
        .filter((a) => a.name != "TPose")
        .forEach((a: THREE.AnimationClip) => {
          console.log(a.name);
          animationsMap.set(a.name, mixer.clipAction(a));
        });

      const rigidBody = self.g_gamesa
        .getPhysicsObject()
        .addPlayerPhysics(true, () => {});

      self.controller = new CPlayerController(
        model,
        mixer,
        animationsMap,
        self.g_gamesa.getCamera().getCamera(),
        self.g_core.getRenderer().GetCamera(),
        "IDLE_stance",
        new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }),
        rigidBody
      );
    });

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.altKey && this.controller) {
          this.controller.switchRunToggle();
        }
        this.keysPressed[event.key.toLowerCase()] = true;
      },
      false
    );
    document.addEventListener(
      "keyup",
      (event) => {
        this.keysPressed[event.key.toLowerCase()] = false;
      },
      false
    );
  }

  public update() {
    let deltaTime = clock.getDelta();

    if (this.controller) {
      this.controller.update(
        this.g_gamesa.getWorld().getPhysicsWorld(),
        deltaTime,
        this.keysPressed
      );
    }
  }
}

export { CPlayerSA };
