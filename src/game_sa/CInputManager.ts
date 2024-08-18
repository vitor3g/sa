import { CCore } from "@/app/CCore";

export enum KEYS {
  A = "KeyA",
  S = "KeyS",
  W = "KeyW",
  D = "KeyD",
  SPACE = "Space",
  SHIFT_L = "ShiftLeft",
  SHIFT_R = "ShiftRight",
  ALT_L = "AltLeft",
}

type MouseState = {
  LeftButton: boolean;
  RightButton: boolean;
  MouseXDelta: number;
  MouseYDelta: number;
  MouseWheelDelta: number;
};

// * constants
const MIN_ZOOM_LEVEL = 0.001; // needs to be slightly bigger than zero
const MAX_ZOOM_LEVEL = 20;
const SCROLL_LEVEL_STEP = 1.5;

class CInputManager {
  private m_target: Document;
  public m_currentMouse: MouseState;
  public m_currentKeys: Map<string, boolean>;
  public m_pointerLocked: boolean;

  constructor(private readonly g_core: CCore) {
    this.m_target = document;
    this.m_currentMouse = {
      LeftButton: false,
      RightButton: false,
      MouseXDelta: 0,
      MouseYDelta: 0,
      MouseWheelDelta: 0,
    };
    this.m_currentKeys = new Map<string, boolean>();
    this.m_pointerLocked = false;

    this.init();
  }

  public init() {
    this.m_target.addEventListener(
      "mousedown",
      (e) => this.onMouseDown(e),
      false
    );
    this.m_target.addEventListener(
      "mousemove",
      (e) => this.onMouseMove(e),
      false
    );

    this.m_target.addEventListener("mouseup", (e) => this.onMouseUp(e), false);

    // Mouse Wheel
    addEventListener("wheel", (e) => this.onMouseWheel(e), false);

    // keyboard event handlers
    this.m_target.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    this.m_target.addEventListener("keyup", (e) => this.onKeyUp(e), false);

    const renderer = this.g_core.getRenderer().renderer;

    // handling pointer lock
    const addPointerLockEvent = async () => {
      await renderer.domElement.requestPointerLock();
    };

    renderer.domElement.addEventListener("click", addPointerLockEvent);
    renderer.domElement.addEventListener("dblclick", addPointerLockEvent);
    renderer.domElement.addEventListener("mousedown", addPointerLockEvent);

    const setPointerLocked = () => {
      this.m_pointerLocked =
        document.pointerLockElement === renderer.domElement;
    };

    document.addEventListener("pointerlockchange", setPointerLocked, false);
  }

  private onMouseWheel(e: WheelEvent) {
    const changeMouseWheelLevel = () => {
      if (this.m_pointerLocked) {
        if (e.deltaY < 0) {
          this.m_currentMouse.MouseWheelDelta = Math.max(
            this.m_currentMouse.MouseWheelDelta - SCROLL_LEVEL_STEP,
            MIN_ZOOM_LEVEL
          );
        } else if (e.deltaY > 0) {
          this.m_currentMouse.MouseWheelDelta = Math.min(
            this.m_currentMouse.MouseWheelDelta + SCROLL_LEVEL_STEP,
            MAX_ZOOM_LEVEL
          );
        }
      }
    };

    changeMouseWheelLevel();
  }

  private onMouseMove(e: MouseEvent) {
    if (this.m_pointerLocked) {
      this.m_currentMouse.MouseXDelta = e.movementX;
      this.m_currentMouse.MouseYDelta = e.movementY;
    }
  }

  private onMouseDown(e: MouseEvent) {
    if (this.m_pointerLocked) {
      this.onMouseMove(e);

      // * right click, left click
      switch (e.button) {
        case 0: {
          this.m_currentMouse.LeftButton = true;
          break;
        }
        case 2: {
          this.m_currentMouse.RightButton = true;
          break;
        }
      }
    }
  }

  private onMouseUp(e: MouseEvent) {
    if (this.m_pointerLocked) {
      this.onMouseMove(e);

      // * right click, left click
      switch (e.button) {
        case 0: {
          this.m_currentMouse.LeftButton = false;
          break;
        }
        case 2: {
          this.m_currentMouse.RightButton = false;
          break;
        }
      }
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.m_pointerLocked) {
      this.m_currentKeys.set(e.code, true);
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    if (this.m_pointerLocked) {
      this.m_currentKeys.set(e.code, false);
    }
  }

  public isKeyDown(keyCode: string | number) {
    if (this.m_pointerLocked) {
      const hasKeyCode = this.m_currentKeys.get(keyCode as string);
      if (hasKeyCode) {
        return hasKeyCode;
      }
    }

    return false;
  }

  public update() {
    this.m_currentMouse.MouseXDelta = 0;
    this.m_currentMouse.MouseYDelta = 0;
  }

  public runActionByKey(key: string, action: Function, inAction?: Function) {
    // * run function if the key is pressed
    if (this.isKeyDown(key)) {
      return action();
    } else {
      return inAction && inAction();
    }
  }

  public runActionByOneKey(
    keys: Array<string>,
    action: Function,
    inAction?: Function
  ) {
    // * run the function if one of the keys in the 'keys' array is pressed
    let check = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      check = this.isKeyDown(key);

      if (check) {
        break;
      }
    }

    if (check) {
      return action();
    } else {
      return inAction && inAction();
    }
  }

  public runActionByAllKeys(
    keys: Array<string>,
    action: Function,
    inAction?: Function
  ) {
    // * if all of the keys in the 'keys' array are pressed at the same time, run the function
    let check = true;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      check = this.isKeyDown(key);

      if (!check) {
        break;
      }
    }

    if (check) {
      return action();
    } else {
      return inAction && inAction();
    }
  }

  public runActionByPattern(
    keys: string[],
    action: (activeKeys: string[]) => void
  ) {
    const activeKeys = keys.filter((key) => this.isKeyDown(key));
    return activeKeys.length > 0 && action(activeKeys);
  }
}

export { CInputManager };
