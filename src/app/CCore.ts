import { CRenderer } from "@/renderer/Graphics/CRenderer";

class CCore {
  private readonly renderer: CRenderer;

  constructor() {
    this.renderer = new CRenderer(this);
  }

  async getRenderer() {
    return this.renderer;
  }
}

export { CCore };
