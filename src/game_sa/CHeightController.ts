import { GRAVITY } from "@/physics/CRapierConstants";
import { clamp, lerp, UpDownCirc } from "@/utils/math";

const JUMP_DURATION = 0.5;
const JUMP_AMPLITUDE = 0.5;

class CHeightController {
  height: number;
  lastHeight: number;
  movePerFrame: number;
  lastGroundHeight: number;
  startFallAnimation: number;
  isAnimating: boolean;
  grounded: boolean;
  jumpFactor: number;
  startJumpAnimation: number;

  constructor() {
    this.height = 0;
    this.lastHeight = this.height;
    this.movePerFrame = 0;
    this.lastGroundHeight = this.height;
    this.startFallAnimation = 0;
    this.startJumpAnimation = 0;
    this.jumpFactor = 0;
    this.isAnimating = false;
    this.grounded = false;
  }

  update(timestamp: number, timeDiff: number) {
    this.isAnimating = !this.grounded;

    if (this.isAnimating) {
      const t = timestamp - this.startFallAnimation;

      this.height = 0.5 * GRAVITY.y * t * t;

      this.movePerFrame = this.height - this.lastHeight;
    } else {
      // reset the animation
      this.height = 0;
      this.lastHeight = 0;
      this.movePerFrame = 0;
      this.startFallAnimation = timestamp;
    }

    const jt = timestamp - this.startJumpAnimation;
    if (this.grounded && jt > JUMP_DURATION) {
      this.jumpFactor = 0;
      this.startJumpAnimation = timestamp;
    } else {
      this.movePerFrame += lerp(
        0,
        this.jumpFactor * JUMP_AMPLITUDE,
        UpDownCirc(clamp(jt / JUMP_DURATION, 0, 1))
      );
    }

    this.lastHeight = this.height;
  }

  setGrounded(grounded: boolean) {
    this.grounded = grounded;
  }

  setJumpFactor(jumpFactor: number) {
    this.jumpFactor = jumpFactor;
  }
}

export { CHeightController };
