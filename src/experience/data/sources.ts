type SupportedTypes = "gltf" | "texture" | "cubeTexture";

export type Source = {
  name: string;
  type: SupportedTypes;
  path: string | string[];
};

const sources: Source[] = [
  {
    name: "lab_model",
    type: "gltf",
    path: "./models/lab.glb",
  },
  {
    name: "glass_model",
    type: "gltf",
    path: "./models/glass.glb",
  },
  {
    name: "lab_texture_p1",
    type: "texture",
    path: "./textures/compressed/lab_p1.webp",
  },
  {
    name: "lab_texture_p2",
    type: "texture",
    path: "./textures/compressed/lab_p2.webp",
  },
  {
    name: "lab_texture_p3",
    type: "texture",
    path: "./textures/compressed/lab_p3.webp",
  },
  {
    name: "steam_texture",
    type: "texture",
    path: "./textures/perlin/steam.webp",
  },
  {
    name: "env_map",
    type: "cubeTexture",
    path: [
      "./textures/envmap/px.webp",
      "./textures/envmap/nx.webp",
      "./textures/envmap/py.webp",
      "./textures/envmap/ny.webp",
      "./textures/envmap/pz.webp",
      "./textures/envmap/nz.webp",
    ],
  },
];

export default sources;
