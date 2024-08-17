import { CCore } from "@/app/CCore";
import { CCamera } from "./CCamera";

class CGameSA {
  private readonly CCamera: CCamera;

  constructor(private readonly g_core: CCore) {
    this.CCamera = new CCamera(this.g_core);
  }

  public GetCamera() {
    return this.CCamera;
  }
}

export { CGameSA };
