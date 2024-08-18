import { CCore } from "@/app/CCore";
import { ImGui, ImGui_Impl } from "@zhobo63/imgui-ts";
class CGUI {
  constructor(private readonly g_core: CCore) {
    this.init();
  }

  private async init() {
    await ImGui.default();

    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    const io: ImGui.IO = ImGui.GetIO();
    ImGui.StyleColorsDark();
    io.Fonts.AddFontDefault();

    ImGui_Impl.Init(this.g_core.getRenderer().renderer.domElement);

    // Start the rendering loop
    requestAnimationFrame(this.Draw);
  }

  public Draw = (time: number): void => {
    // Request the next frame
    requestAnimationFrame(this.Draw);

    this.g_core.getRenderer().renderer.state.reset();

    // New frame for ImGui
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    // Render the ImGui demo window (or any custom UI)
    // ImGui.ShowDemoWindow();

    // Render the Three.js scene

    // End the ImGui frame and render the ImGui UI
    ImGui.EndFrame();
    ImGui.Render();
    this.g_core.getRenderer().Draw();

    // Render the ImGui draw data
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
  };
}

export { CGUI };
