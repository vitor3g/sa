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

    ImGui_Impl.Init(this.g_core.GetRenderer().renderer.domElement);

    requestAnimationFrame(this.Draw);
  }

  public Draw = (time: number): void => {
    requestAnimationFrame(this.Draw);

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    // ImGui.ShowDemoWindow();

    ImGui.EndFrame();
    ImGui.Render();

    this.g_core.GetRenderer().Draw();
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
  };
}

export { CGUI };
