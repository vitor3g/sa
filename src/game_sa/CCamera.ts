import { CCore } from "@/app/CCore";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class CCamera {
  private camera: OrbitControls;

  constructor(private readonly g_core: CCore) {
    this.camera = new OrbitControls(
      this.g_core.getRenderer().GetCamera(),
      this.g_core.getRenderer().renderer.domElement
    );

    this.camera.enableDamping = true;
    this.camera.enablePan = true;
    this.camera.minDistance = 3;
    this.camera.maxDistance = 3;
    this.camera.maxPolarAngle = Math.PI / 2 - 0.05;
    this.camera.minPolarAngle = Math.PI / 4;

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
