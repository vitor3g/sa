import { CRenderer } from "@/renderer/Graphics/CRenderer";
import { ImGui, ImGui_Impl } from "@/utils/ImGui";

class ImGUI {
  private renderer: CRenderer;

  constructor(renderer: CRenderer) {
    this.renderer = renderer;
    this.init();
  }

  private async init() {
    await ImGui.default();
    ImGui.CreateContext();

    ImGui_Impl.Init(this.renderer.getRenderer().domElement);

    this.animate();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    ImGui_Impl.NewFrame();
    ImGui.NewFrame();

    ImGui.Begin("Painel de Controle");
    ImGui.Text("Hello, world!");
    ImGui.End();
    ImGui.EndFrame();
    ImGui.Render();
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
  };
}

export { ImGUI };
