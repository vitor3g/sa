import { CCore } from "@/app/CCore";
import { CCamera } from "./CCamera";

import { CLighting } from "./CLighting";
import { CWorldSA } from "./CWorldSA";
import { CPlayerSA } from "./CPlayerSA";

import { CPhysicsObject } from "./CPhysicsObject";
import { CTickManager } from "./CTickManager";

class CGameSA {
  private readonly CCamera: CCamera;
  private readonly CWorldSA: CWorldSA;
  private readonly CLighting: CLighting;
  private readonly CPlayerSA: CPlayerSA;
  private readonly CPhysicsObject: CPhysicsObject;
  private readonly CTickManager: CTickManager;

  constructor(private readonly g_core: CCore) {
    this.CCamera = new CCamera(this.g_core);
    this.CLighting = new CLighting(this.g_core);
    this.CPhysicsObject = new CPhysicsObject(this);
    this.CWorldSA = new CWorldSA(this.g_core, this);

    this.CPlayerSA = new CPlayerSA(this.g_core, this);
    this.CTickManager = new CTickManager(undefined, this.g_core, this);

    this.Init();
  }

  public Init() {
    this.CLighting.Init();
    this.CWorldSA.Init();
    this.CTickManager.startLoop();
  }

  public getPlayer() {
    return this.CPlayerSA;
  }

  public getCamera() {
    return this.CCamera;
  }

  public getWorld() {
    return this.CWorldSA;
  }

  public getLighting() {
    return this.CLighting;
  }

  public getPhysicsObject() {
    return this.CPhysicsObject;
  }
}

export { CGameSA };
