uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 smokeUv = vUv;
  smokeUv *= 0.2;
  smokeUv.y -= uTime * 0.03;

  float smoke = texture(uTexture, smokeUv).r;
  smoke = smoothstep(0.4, 1.0, smoke);

  smoke *= smoothstep(0.0, 0.2, vUv.x);
  smoke *= smoothstep(1.0, 0.8, vUv.x);
  smoke *= smoothstep(0.0, 0.05, vUv.y);
  smoke *= smoothstep(1.0, 0.6, vUv.y);

  gl_FragColor = vec4(uColor, smoke * 0.5);
}