import { CustomEvent } from "./custom.event";

// const goodMaterial = [
//   2825350831,
//   2737678298,
//   1333033863,
//   3008270349,
//   3933216577,
//   3833216577,
//   2128369009
// ]

const positions: Array<Array<Vector3Mp>> = [
  [
    new mp.Vector3(5356.91, -5364.83, 41.96),
    new mp.Vector3(5371.04, -5349.06, 40.49),
    new mp.Vector3(5382.51, -5331.66, 36.56),
    new mp.Vector3(5381.93, -5322.13, 37.37),
    new mp.Vector3(5345.44, -5295.80, 36.59),
    new mp.Vector3(5316.61, -5323.85, 36.58),
  ],
  [
    new mp.Vector3(5304.00, -5314.79, 35.38),
    new mp.Vector3(5288.73, -5295.49, 32.83),
    new mp.Vector3(5290.73, -5291.28, 32.72),
    new mp.Vector3(5298.89, -5280.43, 32.28),
    new mp.Vector3(5315.20, -5264.85, 32.88),
    new mp.Vector3(5321.42, -5270.95, 33.59),
    new mp.Vector3(5331.97, -5284.74, 35.31),
    new mp.Vector3(5332.00, -5289.29, 35.69),
  ],
  [
    new mp.Vector3(5297.61, -5263.15, 32.03),
    new mp.Vector3(5269.16, -5234.96, 27.59),
    new mp.Vector3(5279.82, -5219.51, 29.77),
    new mp.Vector3(5308.22, -5247.95, 32.54),
    new mp.Vector3(5305.41, -5257.36, 32.62),
  ],
  [
    new mp.Vector3(5321.04, -5238.19, 32.78),
    new mp.Vector3(5285.13, -5205.72, 29.33),
    new mp.Vector3(5301.89, -5186.45, 30.09),
    new mp.Vector3(5307.54, -5188.05, 30.86),
    new mp.Vector3(5339.28, -5220.33, 31.73),
  ],
  [
    new mp.Vector3(5352.22, -5208.60, 31.12),
    new mp.Vector3(5313.38, -5173.18, 29.18),
    new mp.Vector3(5321.86, -5166.19, 27.77),
    new mp.Vector3(5334.91, -5152.58, 26.48),
    new mp.Vector3(5337.60, -5146.83, 25.15),
    new mp.Vector3(5344.50, -5138.80, 22.35),
    new mp.Vector3(5388.18, -5171.25, 31.05),
  ]
]

const shapes: any[] = [];

positions.forEach((position, index) => {
  shapes[index] = mp.polygons.add(position, 4);
})


CustomEvent.registerServer("client::drugFarm:isInGround", () => {
  return mp.players.local.getHeightAboveGround() < 2 && isPoint();
})

const isPoint = () => {
  const pos = mp.players.local.position;

  let isPoint = false;

  shapes.forEach((shape, index) => {
    if (mp.polygons.isPositionWithinPolygon(pos, shape)) {
      isPoint = true;
    }
  })

  return isPoint;
}
// const getMaterial = () => {
//   const player = mp.players.local;

//   const raycast = mp.raycasting.testCapsule(player.position.add(new mp.Vector3(0, 0, 0)), player.position.add(new mp.Vector3(0, 0, -0.75)), 1, [mp.players.local.handle], 1 as any);
//   if (!raycast) return;


//   return raycast.material;
// }