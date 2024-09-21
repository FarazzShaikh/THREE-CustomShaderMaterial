uniform sampler2D uMap;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uMap, vUv);
    csm_DiffuseColor = color;
    csm_DepthAlpha = color.a;
}