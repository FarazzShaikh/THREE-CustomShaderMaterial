varying float vVisibility;
varying vec3 vViewNormal;

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
    vec2 cUV = 2. * uv - 1.;
    float a = .15 / length(cUV);
    float alpha = 1.;
    if(a < 0.15) alpha = 0.;

    csm_DiffuseColor = vec4(vViewNormal, (vVisibility + 0.01) * alpha);
}
