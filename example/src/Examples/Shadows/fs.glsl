uniform sampler2D uMap;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uMap, vUv);
    csm_DiffuseColor = color;
    csm_DepthAlpha = 1.0 - color.a;
}