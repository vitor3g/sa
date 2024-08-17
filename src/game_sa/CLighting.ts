import * as THREE from "three";
import { CCore } from "@/app/CCore";

class CLighting {
  constructor(private readonly g_core: CCore) {
    this.Init();
  }

  public Init() {
    this.g_core
      .getRenderer()
      .GetScene()
      .add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);

    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;

    this.g_core.getRenderer().GetScene().add(dirLight);
  }
}

export { CLighting };
