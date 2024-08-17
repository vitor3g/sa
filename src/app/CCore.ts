import { CGameSA } from "@/game_sa/CGameSA";
import { CRenderer } from "@/renderer/Graphics/CRenderer";
import { CGUI } from "@/renderer/GUI/CGUI";

class CCore {
  private readonly Renderer: CRenderer;
  private readonly GUI: CGUI;
  private readonly CGameSA: CGameSA;

  constructor() {
    this.Renderer = new CRenderer();
    this.GUI = new CGUI(this);
    this.CGameSA = new CGameSA(this);
  }

  public GetRenderer() {
    return this.Renderer;
  }

  public GetGUI() {
    return this.GUI;
  }

  public GetGameSA() {
    return this.CGameSA;
  }
}

export { CCore };
