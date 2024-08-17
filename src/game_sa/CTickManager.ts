import { CCore } from "@/app/CCore";
import * as THREE from "three";
import { CGameSA } from "./CGameSA";

// animation params
type Frame = XRFrame | null;

export type TickData = {
  timestamp: number;
  timeDiff: number;
  fps: number;
  frame: Frame;
};

const localTickData: TickData = {
  timestamp: 0,
  timeDiff: 0,
  fps: 0,
  frame: null,
};

const localFrameOpts = {
  data: localTickData,
};

const frameEvent = new MessageEvent("tick", localFrameOpts);

class CTickManager extends EventTarget {
  timestamp: number;
  timeDiff: number;
  frame: Frame;
  lastTimestamp: number;
  fps: number;

  constructor(
    { timestamp, timeDiff, frame } = localTickData,
    private readonly g_core: CCore,
    private readonly g_gamesa: CGameSA
  ) {
    super();

    this.timestamp = timestamp;
    this.timeDiff = timeDiff;
    this.frame = frame;
    this.lastTimestamp = 0;
    this.fps = 0;
  }

  startLoop() {
    // const camera = useCamera()
    const renderer = this.g_core.getRenderer().renderer;
    const physics = this.g_gamesa.getWorld().getPhysicsWorld();
    const physicsObjects = this.g_gamesa.getWorld().getPhysicsObjects();
    const controls = this.g_gamesa.getPlayer();

    if (!renderer) {
      throw new Error("Updating Frame Failed : Uninitialized Renderer");
    }

    const animate = (timestamp: number, frame: Frame) => {
      const now = performance.now();
      this.timestamp = timestamp ?? now;
      this.timeDiff = timestamp - this.lastTimestamp;

      const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100);

      // physics
      physics.step();

      for (let i = 0; i < physicsObjects.length; i++) {
        const po = physicsObjects[i];
        const autoAnimate = po.autoAnimate;

        if (autoAnimate) {
          const mesh = po.mesh;
          const collider = po.collider;

          if (mesh) {
            mesh.position.copy(collider.translation() as THREE.Vector3);
            mesh.quaternion.copy(collider.rotation() as THREE.Quaternion);
          }
        }

        const fn = po.fn;
        fn && fn();
      }

      // performance tracker start
      this.fps = 1000 / this.timeDiff;
      this.lastTimestamp = this.timestamp;

      controls.update(timestamp / 1000, timeDiffCapped / 1000);

      this.tick(timestamp, timeDiffCapped, this.fps, frame);
    };

    renderer.setAnimationLoop(animate);
  }

  tick(timestamp: number, timeDiff: number, fps: number, frame: Frame) {
    localTickData.timestamp = timestamp;
    localTickData.frame = frame;
    localTickData.timeDiff = timeDiff;
    localTickData.fps = fps;
    this.dispatchEvent(frameEvent);
  }
}

export { CTickManager };
