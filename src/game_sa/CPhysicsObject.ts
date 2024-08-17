import * as THREE from "three";
import Rapier from "@dimforge/rapier3d";
import { CGameSA } from "./CGameSA";
import RAPIER from "@dimforge/rapier3d";
import { CONTROLLER_BODY_RADIUS } from "./CPlayerController";

export type PhysicsObject = {
  mesh?: THREE.Mesh;
  collider: Rapier.Collider;
  rigidBody: Rapier.RigidBody;
  fn?: Function;
  autoAnimate: boolean;
};

class CPhysicsObject {
  constructor(private readonly g_gamesa: CGameSA) {}

  public addPlayerPhysics(
    autoAnimate: boolean = true,
    postPhysicsFn?: Function
  ) {
    const physics = this.g_gamesa.getWorld().getPhysicsWorld();
    const physicsObjects = this.g_gamesa.getWorld().getPhysicsObjects();

    const bodyDesc =
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-1, 3, 1);

    const rigidBody = physics.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.ball(CONTROLLER_BODY_RADIUS);
    const collider = physics.createCollider(colliderDesc, rigidBody);

    const physicsObject: PhysicsObject = {
      collider,
      rigidBody,
      fn: postPhysicsFn,
      autoAnimate,
    };

    physicsObjects.push(physicsObject);

    console.log("colliderDesc", colliderDesc);
    //
    return rigidBody;
  }

  public addMeshPhysics(
    mesh: THREE.Mesh,
    rigidBodyType: string,
    autoAnimate: boolean = true, // update the mesh's position and quaternion based on the physics world every frame
    postPhysicsFn?: Function,
    colliderType?: string,
    colliderSettings?: any
  ) {
    const physics = this.g_gamesa.getWorld().getPhysicsWorld();
    const physicsObjects = this.g_gamesa.getWorld().getPhysicsObjects();

    const rigidBodyDesc = (RAPIER.RigidBodyDesc as any)[rigidBodyType]();
    rigidBodyDesc.setTranslation(
      mesh.position.x,
      mesh.position.y,
      mesh.position.z
    );

    // * Responsible for collision response
    const rigidBody = physics.createRigidBody(rigidBodyDesc);

    let colliderDesc;

    switch (colliderType) {
      case "cuboid":
        {
          const { width, height, depth } = colliderSettings;
          colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth);
        }
        break;

      case "ball":
        {
          const { radius } = colliderSettings;
          colliderDesc = RAPIER.ColliderDesc.ball(radius);
        }
        break;

      case "capsule":
        {
          const { halfHeight, radius } = colliderSettings;
          colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius);
        }
        break;

      default:
        {
          colliderDesc = RAPIER.ColliderDesc.trimesh(
            mesh.geometry.attributes.position.array as Float32Array,
            mesh.geometry.index?.array as Uint32Array
          );
        }
        break;
    }

    if (!colliderDesc) {
      console.error("Collider Mesh Error: convex mesh creation failed.");
    }

    // * Responsible for collision detection
    const collider = physics.createCollider(colliderDesc, rigidBody);

    const physicsObject: PhysicsObject = {
      mesh,
      collider,
      rigidBody,
      fn: postPhysicsFn,
      autoAnimate,
    };

    physicsObjects.push(physicsObject);

    return physicsObject;
  }
}

export { CPhysicsObject };
