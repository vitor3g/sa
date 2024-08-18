import { CCore } from "@/app/CCore";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class CCamera {
  private camera: OrbitControls;

  constructor(private readonly g_core: CCore) {
    this.camera = new OrbitControls(
      this.g_core.getRenderer().GetCamera(),
      this.g_core.getRenderer().renderer.domElement
    );

    this.camera.enableRotate = true;
    this.camera.enablePan = true;
    this.camera.enableZoom = true;
    this.camera.maxPolarAngle = Math.PI / 2.1;
    this.camera.minPolarAngle = Math.PI / 4;
    this.camera.target.set(0, 1, 0);
    this.camera.update();

    this.camera.minDistance = 3;
    this.camera.maxDistance = 3;

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
