import ProtoId from '../proto/protoid.json';

// make bidrectional
export const ProtoName: { [id: number]: keyof (typeof ProtoId) } = Object.fromEntries(
  Object.entries(ProtoId).map((entry) => entry.reverse())
)