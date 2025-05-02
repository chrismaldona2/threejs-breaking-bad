type SupportedTypes = "gltf" | "texture";

export type Source = {
  name: string;
  type: SupportedTypes;
  path: string;
};

const sources: Source[] = [
  {
    name: "lab_p1",
    type: "gltf",
    path: "./lab_p1.glb",
  },
  {
    name: "lab_p1_texture",
    type: "texture",
    path: "./lab_p1.webp",
  },
  {
    name: "lab_p2",
    type: "gltf",
    path: "./lab_p2.glb",
  },
  {
    name: "lab_p2_texture",
    type: "texture",
    path: "./lab_p2.webp",
  },
  {
    name: "lab_p3",
    type: "gltf",
    path: "./lab_p3.glb",
  },
  {
    name: "lab_p3_texture",
    type: "texture",
    path: "./lab_p3.webp",
  },
];

export default sources;
