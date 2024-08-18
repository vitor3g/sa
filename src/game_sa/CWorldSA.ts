import * as THREE from "three";
import { wrapAndRepeatTexture } from "@/utils/utils";
import { CCore } from "@/app/CCore";
import { GRAVITY } from "@/physics/CRapierConstants";
import RAPIER from "@dimforge/rapier3d";
import { PhysicsObject } from "./CPhysicsObject";
import { CGameSA } from "./CGameSA";

class CWorldSA {
  private m_physicsWorld: RAPIER.World;
  private m_physicsObjects: PhysicsObject[];

  constructor(
    private readonly g_core: CCore,
    private readonly g_gamesa: CGameSA
  ) {
    const RAPIER = g_core.getRapier();

    this.m_physicsWorld = new RAPIER.World(GRAVITY);
    this.m_physicsObjects = [];
  }

  public Init() {
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/placeholder.png");
    const WIDTH = 80;
    const LENGTH = 80;
    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial({
      map: placeholder,
    });

    if (material.map) {
      wrapAndRepeatTexture(material.map);
    }

    if (material.normalMap) {
      wrapAndRepeatTexture(material.normalMap);
    }

    if (material.displacementMap) {
      wrapAndRepeatTexture(material.displacementMap);
    }

    if (material.aoMap) {
      wrapAndRepeatTexture(material.aoMap);
    }

    const floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;

    // physics
    this.g_gamesa.getPhysicsObject().addMeshPhysics(
      floor,
      "fixed",
      true,
      () => {
        floor.rotation.x -= Math.PI / 2;
      },
      "cuboid",
      {
        width: WIDTH / 2,
        height: 0.001,
        depth: LENGTH / 2,
      }
    ).collider;

    // Adicionar o chão à cena
    this.g_core.getRenderer().GetScene().add(floor);

    // Resetar o estado do WebGL antes de renderizar o ImGui
    this.g_core.getRenderer().renderer.state.reset();

    for (let i = 0; i < 10; i++) {
      this._addCubeMesh(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          10 + i * 5,
          (Math.random() - 0.5) * 20
        )
      );
    }
  }

  public _addCubeMesh = (pos: THREE.Vector3) => {
    // * Settings
    const size = 1;

    // * Mesh
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHex(
        Math.min(Math.random() + 0.15, 1) * 0xffffff
      ),
      side: THREE.DoubleSide,
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.copy(pos);
    cube.position.y += 2;

    // * Physics
    this.g_gamesa
      .getPhysicsObject()
      .addMeshPhysics(cube, "dynamic", true, undefined, "cuboid", {
        width: size / 2,
        height: size / 2,
        depth: size / 2,
      }).collider;

    // * Add the mesh to the scene
    this.g_core.getRenderer().GetScene().add(cube);
  };

  public getPhysicsWorld() {
    return this.m_physicsWorld;
  }

  public getPhysicsObjects(): PhysicsObject[] {
    return this.m_physicsObjects;
  }
}

export { CWorldSA };
