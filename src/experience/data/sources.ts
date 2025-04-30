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
    path: "./glass_test.glb",
  },
  {
    name: "labBakedTexture",
    type: "texture",
    path: "./glass_test.png",
  },
];

export default sources;
