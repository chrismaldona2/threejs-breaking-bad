uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;

uniform float uSteamUvScale;
uniform float uSteamSpeed;
uniform float uSteamThresholdLow;
uniform float uSteamThresholdHigh;
uniform float uSteamOpacity;


varying vec2 vUv;

void main() {
  vec2 steamUv = vUv;
  steamUv *= uSteamUvScale;
  steamUv.y -= uTime * uSteamSpeed;

  float steam = texture(uTexture, steamUv).r;
  steam = smoothstep(uSteamThresholdLow, uSteamThresholdHigh, steam);

  steam *= smoothstep(0.0, 0.2, vUv.x);
  steam *= smoothstep(1.0, 0.8, vUv.x);
  steam *= smoothstep(0.0, 0.05, vUv.y);
  steam *= smoothstep(1.0, 0.6, vUv.y);

  gl_FragColor = vec4(uColor, steam * uSteamOpacity);
}