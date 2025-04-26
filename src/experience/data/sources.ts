type SupportedTypes = "gltf" | "texture";

export type Source = {
  name: string;
  type: SupportedTypes;
  path: string;
};

const sources: Source[] = [
  {
    name: "labModel",
    type: "gltf",
    path: "./scene.glb",
  },
  {
    name: "labBakedTexture",
    type: "texture",
    path: "./baked.jpg",
  },
];

export default sources;
