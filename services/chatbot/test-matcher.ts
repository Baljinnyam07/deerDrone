import { matchProducts } from "./src/productMatcher.js";

async function run() {
  console.log("Neo 2:", (await matchProducts("Neo 2")).map(p => p.name));
  console.log("DJI AVATA 360 FLYMORE COMBO:", (await matchProducts("DJI AVATA 360 FLYMORE COMBO")).map(p => p.name));
}
run();
