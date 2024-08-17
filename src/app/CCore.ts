import { CGameSA } from "@/game_sa/CGameSA";
import { PhysicsEngine } from "@/main";
import { CRenderer } from "@/renderer/Graphics/CRenderer";
import { CGUI } from "@/renderer/GUI/CGUI";

class CCore {
  private readonly Renderer: CRenderer;
  private readonly CGUI: CGUI;
  private readonly CGameSA: CGameSA;

  constructor(private readonly g_physicsEngine: PhysicsEngine) {
    this.Renderer = new CRenderer();
    this.CGameSA = new CGameSA(this);
    this.CGUI = new CGUI(this);
  }

  public getRenderer() {
    return this.Renderer;
  }

  public getGUI() {
    return this.CGUI;
  }

  public getGameSA() {
    return this.CGameSA;
  }

  public getRapier() {
    return this.g_physicsEngine;
  }
}

export { CCore };
