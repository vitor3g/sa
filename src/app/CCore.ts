import { CRenderer } from "@/renderer/Graphics/CRenderer";
import { CGUI } from "@/renderer/GUI/CGUI";

class CCore {
  private readonly Renderer: CRenderer;
  private readonly Gui: CGUI;

  constructor() {
    this.Renderer = new CRenderer();
    this.Gui = new CGUI(this);
  }

  public GetRenderer() {
    return this.Renderer;
  }
}

export { CCore };
