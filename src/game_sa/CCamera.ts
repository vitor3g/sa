import { CCore } from "@/app/CCore";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class CCamera {
  private camera: OrbitControls;

  constructor(private readonly g_core: CCore) {
    this.camera = new OrbitControls(
      this.g_core.GetRenderer().GetCamera(),
      this.g_core.GetRenderer().renderer.domElement
    );

    this.camera.enableDamping = true;
    this.camera.minDistance = 5;
    this.camera.maxDistance = 15;
    this.camera.enablePan = false;
    this.camera.maxPolarAngle = Math.PI / 2;

    this.update();
  }

  public update() {
    return this.camera.update();
  }

  public getCamera(): OrbitControls {
    return this.camera;
  }
}

export { CCamera };
