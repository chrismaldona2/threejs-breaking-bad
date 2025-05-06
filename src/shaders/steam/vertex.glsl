#include ../partials/rotate2d.glsl

uniform float uTime;
uniform sampler2D uTexture;

uniform float uTwistSpeed;
uniform float uTwistAmount;
uniform float uWindSpeed;
uniform float uWindStrength;
uniform float uWindExponent;

varying vec2 vUv;

void main() {
  vec3 newPosition = position;

  float perlinTwist = texture(uTexture, vec2(0.5, uv.y * 0.1 - uTime * uTwistSpeed)).r;
  float angle = perlinTwist * uTwistAmount;

  newPosition.xz = rotate2D(newPosition.xz, angle);

  vec2 windOffset = vec2(
    texture(uTexture, vec2(0.25, uTime * uWindSpeed)).r - 0.5,
    texture(uTexture, vec2(0.75, uTime * uWindSpeed)).r - 0.5
  );
  windOffset *= pow(uv.y, uWindExponent) * uWindStrength;
  newPosition.xz += windOffset;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  vUv = uv;
}