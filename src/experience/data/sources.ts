type GLTFSource = { name: string; type: "gltf"; path: string };
type TextureSource = { name: string; type: "texture"; path: string };
type AudioSource = { name: string; type: "audio"; path: string };
type CubeTextureSource = { name: string; type: "cubeTexture"; path: string[] };

export type Source =
  | GLTFSource
  | TextureSource
  | AudioSource
  | CubeTextureSource;

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
  {
    name: "main_theme",
    type: "audio",
    path: "./audio/main_theme.mp3",
  },
  {
    name: "switch_sfx",
    type: "audio",
    path: "./audio/switch_2.mp3",
  },
];

export default sources;
