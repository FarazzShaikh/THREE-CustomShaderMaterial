import displace from "./utils/displace";

export default `
uniform float time;

float scale = 0.2;
float zscale = 0.3;

float seed = 1.0;
float persistance = 0.5;
float lacunarity = 2.0;
float redistribution = 1.0;

float xoff = 0.0;
float yoff = 0.0;
int octaves = 1;


${displace}

`