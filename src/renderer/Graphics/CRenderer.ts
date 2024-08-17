import * as THREE from "three";
import Stats from "stats.js";

class CRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private stats: Stats;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.y = 5;
    this.camera.position.z = 10;
    this.camera.position.x = -13;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.scene.background = new THREE.Color(0xa8def0);

    document.body.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "0px";

    const dLight = new THREE.DirectionalLight("white", 0.6);

    dLight.position.x = 20;
    dLight.position.y = 30;
    dLight.castShadow = true;
    dLight.shadow.mapSize.width = 4096;
    dLight.shadow.mapSize.height = 4096;
    const d = 35;
    dLight.shadow.camera.left = -d;
    dLight.shadow.camera.right = d;
    dLight.shadow.camera.top = d;
    dLight.shadow.camera.bottom = -d;
    this.scene.add(dLight);

    document.body.appendChild(this.stats.dom);

    window.addEventListener("resize", this.onWindowResize);

    this.Draw();
  }

  private onWindowResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  public Draw = (): void => {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();

    this.renderer.resetState();
  };

  public GetScene(): THREE.Scene {
    return this.scene;
  }

  public GetCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}

export { CRenderer };
