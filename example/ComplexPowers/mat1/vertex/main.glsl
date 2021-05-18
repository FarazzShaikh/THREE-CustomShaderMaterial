
//requires a function vec3 displace(vec3) from geometry.glsl


vec3 newPos = displace(position);

float offset = 0.001;
vec3 tangent = vec3(1,0,0);
vec3 bitangent = vec3(0,1,0);
vec3 neighbour1 = position + tangent * offset;
vec3 neighbour2 = position + bitangent * offset;

vec3 displacedNeighbour1 = displace(neighbour1);
vec3 displacedNeighbour2 = displace(neighbour2);

vec3 displacedTangent = displacedNeighbour1 - newPos;
vec3 displacedBitangent = displacedNeighbour2 - newPos;

vec3 newNormal = normalize(cross(displacedTangent, displacedBitangent));
