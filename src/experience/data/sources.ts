type SupportedTypes = "gltf" | "texture";

export type Source = {
  name: string;
  type: SupportedTypes;
  path: string;
};

const sources: Source[] = [
  {
    name: "sceneModel",
    type: "gltf",
    path: "./scene.glb",
  },
  {
    name: "sceneBakedTexture",
    type: "texture",
    path: "./scene_bake.jpg",
  },
  {
    name: "postersModel",
    type: "gltf",
    path: "./posters.glb",
  },
  {
    name: "postersBakedTexture",
    type: "texture",
    path: "./posters_bake.jpg",
  },
];

export default sources;
