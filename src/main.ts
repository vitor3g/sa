import { CCore } from "@/app/CCore";
import "./style.css";
import InitRapier from "./utils/rapier";

export type PhysicsEngine =
  typeof import("e:/Projects/sa/node_modules/@dimforge/rapier3d/exports");

async function main() {
  const physicsEngine = await InitRapier();
  const engine = new CCore(physicsEngine);
}

(async () => {
  await main();
})();
