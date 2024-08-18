import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { QueryFilterFlags, Ray, RigidBody, World } from "@dimforge/rapier3d";
import { CInputManager, KEYS } from "./CInputManager";
import { CCore } from "@/app/CCore";

// * local variables
export const CONTROLLER_BODY_RADIUS = 0.1;
let cameraAngleX = 0;
let cameraAngleY = 0;

class CPlayerController {
  private model: THREE.Group;
  private mixer: THREE.AnimationMixer;
  private animationsMap: Map<string, THREE.AnimationAction> = new Map(); // Walk, Run, Idle
  private orbitControl: OrbitControls;
  private camera: THREE.Camera;

  // state
  private toggleRun: boolean = true;
  private currentAction: string;

  // temporary data
  private walkDirection = new THREE.Vector3();
  private rotateAngle = new THREE.Vector3(0, 1, 0);
  private rotateQuarternion: THREE.Quaternion = new THREE.Quaternion();
  private storedFall = 0;

  // constants
  private fadeDuration: number = 0.2;
  private runVelocity = 5;
  private walkVelocity = 2;

  private ray: Ray;
  private rigidBody: RigidBody;
  private lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  private inputManager: CInputManager;

  phi: number;
  theta: number;

  constructor(
    private readonly g_core: CCore,
    model: THREE.Group,
    mixer: THREE.AnimationMixer,
    animationsMap: Map<string, THREE.AnimationAction>,
    orbitControl: OrbitControls,
    camera: THREE.Camera,
    currentAction: string,
    ray: Ray,
    rigidBody: RigidBody
  ) {
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap;
    this.currentAction = currentAction;
    this.animationsMap.forEach((value, key) => {
      if (key == currentAction) {
        value.play();
      }
    });

    this.ray = ray;
    this.rigidBody = rigidBody;

    this.orbitControl = orbitControl;
    this.camera = camera;
    this.inputManager = new CInputManager(this.g_core);

    this.phi = 0;
    this.theta = 0;
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }

  public update(world: World, delta: number) {
    let play = "IDLE_stance";

    this.inputManager.runActionByPattern(
      [KEYS.W, KEYS.A, KEYS.S, KEYS.D],
      () => {
        play = "run_player";
      }
    );

    this.toggleRun = true;

    this.inputManager.runActionByKey(KEYS.ALT_L, () => {
      this.toggleRun = false;

      play = "WALK_player";
    });

    if (this.currentAction != play) {
      const toPlay = this.animationsMap.get(play);
      const current = this.animationsMap.get(this.currentAction);

      current?.fadeOut(this.fadeDuration);
      toPlay?.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = play;
    }

    this.mixer.update(delta);

    this.walkDirection.x = this.walkDirection.y = this.walkDirection.z = 0;

    let velocity = 0;

    if (
      this.currentAction == "run_player" ||
      this.currentAction == "WALK_player"
    ) {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );
      // diagonal movement angle offset
      var directionOffset = this.directionOffset();

      // rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk velocity
      velocity =
        this.currentAction == "run_player"
          ? this.runVelocity
          : this.walkVelocity;
    }

    const translation = this.rigidBody.translation();
    if (translation.y < -1) {
      // don't fall below ground
      this.rigidBody.setNextKinematicTranslation({
        x: 0,
        y: 10,
        z: 0,
      });
    } else {
      this.model.position.x = translation.x;
      this.model.position.y = translation.y;
      this.model.position.z = translation.z;

      this.updateCamera();

      this.walkDirection.y += this.lerp(this.storedFall, -9.81 * delta, 0.1);
      this.storedFall = this.walkDirection.y;
      this.ray.origin.x = translation.x;
      this.ray.origin.y = translation.y;
      this.ray.origin.z = translation.z;

      const raycastResult = world.castRay(
        this.ray,
        0.3,
        false,
        QueryFilterFlags.EXCLUDE_SENSORS
      );

      if (raycastResult !== null) {
        const point = this.ray.pointAt(raycastResult.timeOfImpact);
        let diff = translation.y - (point.y + CONTROLLER_BODY_RADIUS);
        if (diff < 0.0) {
          this.storedFall = 0;
          this.walkDirection.y = this.lerp(0, Math.abs(diff), 0.5);
        }
      }
      this.walkDirection.x = this.walkDirection.x * velocity * delta;
      this.walkDirection.z = this.walkDirection.z * velocity * delta;
      this.rigidBody.setNextKinematicTranslation({
        x: translation.x + this.walkDirection.x,
        y: translation.y + this.walkDirection.y,
        z: translation.z + this.walkDirection.z,
      });
    }

    this.inputManager.update();
  }

  private updateCamera() {
    const mouseXDelta = this.inputManager.m_currentMouse.MouseXDelta;
    const mouseYDelta = this.inputManager.m_currentMouse.MouseYDelta;

    cameraAngleX -= mouseXDelta * 0.005;
    cameraAngleY += mouseYDelta * 0.005;

    cameraAngleY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleY));

    const offsetX = 3 * Math.sin(cameraAngleX);
    const offsetZ = 3 * Math.cos(cameraAngleX);
    const offsetY = 3 * Math.sin(cameraAngleY);

    this.camera.position.set(
      this.model.position.x + offsetX,
      this.model.position.y + offsetY,
      this.model.position.z + offsetZ
    );

    this.camera.lookAt(this.model.position);
  }

  private directionOffset() {
    var directionOffset = 0; // w

    this.inputManager.runActionByPattern(
      [KEYS.W, KEYS.A, KEYS.S, KEYS.D],
      () => {
        if (this.inputManager.isKeyDown(KEYS.W)) {
          if (this.inputManager.isKeyDown(KEYS.A)) {
            directionOffset = Math.PI / 4; // w+a
          } else if (this.inputManager.isKeyDown(KEYS.D)) {
            directionOffset = -Math.PI / 4; // w+d
          }
        } else if (this.inputManager.isKeyDown(KEYS.S)) {
          if (this.inputManager.isKeyDown(KEYS.A)) {
            directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
          } else if (this.inputManager.isKeyDown(KEYS.D)) {
            directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
          } else {
            directionOffset = Math.PI; // s
          }
        } else if (this.inputManager.isKeyDown(KEYS.A)) {
          directionOffset = Math.PI / 2; // a
        } else if (this.inputManager.isKeyDown(KEYS.D)) {
          directionOffset = -Math.PI / 2; // d
        }
      }
    );

    return directionOffset;
  }
}

export { CPlayerController };
