export default `

uniform int three_noise_seed;

vec3 three_noise_gradientVecs[12] = vec3[](
    // 2D Vecs
    vec3(1, 1, 0),
    vec3(-1, 1, 0),
    vec3(1, -1, 0),
    vec3(-1, -1, 0),
    // + 3D Vecs
    vec3(1, 0, 1),
    vec3(-1, 0, 1),
    vec3(1, 0, -1),
    vec3(-1, 0, -1),
    vec3(0, 1, 1),
    vec3(0, -1, 1),
    vec3(0, 1, -1),
    vec3(0, -1, -1)
);

vec3 three_noise_offsetMatrix[8] = vec3[](
    // 2D Vecs
    vec3(0, 0, 0),
    vec3(0, 1, 0),
    vec3(1, 0, 0),
    vec3(1, 1, 0),
    // + 3D Vecs
    vec3(0, 0, 1),
    vec3(0, 1, 1),
    vec3(1, 0, 1),
    vec3(1, 1, 1)
);

int three_noise_hash(int a) {
    a = a ^ 61 ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    a = a ^ (a >> 15);
    return a;
}

int three_noise_gradient(vec2 posInCell) {
    int x = three_noise_hash(three_noise_seed + int(posInCell.x));
    int y = three_noise_hash(three_noise_seed + x + int(posInCell.y));
    return y % 4;
}

float three_noise_fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}


float perlin(vec2 pos) {
    vec2 cell = floor(pos);
    vec2 posInCell = pos - cell;

    float gradiantDot[4];
    for (int i = 0; i < 4; i++) {
        vec3 s3 = three_noise_offsetMatrix[i];
        vec2 s = s3.xy;

        vec3 grad3 = three_noise_gradientVecs[
            three_noise_gradient(cell + s)
        ];
        vec2 grad2 = grad3.xy;
        vec2 dist2 = posInCell - s;
    
        gradiantDot[i] = dot(grad2, dist2);
    }

    // Compute the this.fade curve value for x, y, z
    float u = three_noise_fade(posInCell.x);
    float v = three_noise_fade(posInCell.y);

    float value = mix(
        mix(gradiantDot[0], gradiantDot[2], u),
        mix(gradiantDot[1], gradiantDot[3], u),
        v
    );

    return value;
}
`;
