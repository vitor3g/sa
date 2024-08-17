import { CCore } from "@/app/CCore";
import { ImGui, ImGui_Impl } from "@zhobo63/imgui-ts";

let text: ImGui.ImStringBuffer = new ImGui.ImStringBuffer(128, "input text");
let text_area: ImGui.ImStringBuffer = new ImGui.ImStringBuffer(
  128,
  "edit multiline"
);

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

    requestAnimationFrame(this.animate);
  }

  private animate = (time: number): void => {
    requestAnimationFrame(this.animate);

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();
    ImGui.Begin("Hello");
    ImGui.Text("Version " + ImGui.VERSION);
    ImGui.InputText("Input", text);
    ImGui.InputTextMultiline("Text", text_area);
    ImGui.End();
    ImGui.EndFrame();
    ImGui.Render();

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
  };
}

export { CGUI };
