//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
    6.0)-3.0)-1.0,
    0.0,
    1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}





vec3 complexColor(vec2 pol,vec2 rBounds){
    //get complex color from polar representation:
    float rMin=rBounds.x;
    float rMax=rBounds.y;
    float maxExtent=max(pow(rMin,n),pow(rMax,n));

    float R=pol.x;
    float T=pol.y;

    float rad=R/maxExtent;
    float ang=T/(2.*PI);
    vec3 color=hsb2rgb(vec3(ang, rad, 0.5));

    return color;
}


float coordLines(vec2 coords){

    //get brightness from domain:
    float coord1=sin(5.*coords.x);
    float coord2=sin(5.*coords.y);
    float bright=-log(abs(coord1))-log(abs(coord2));
    bright=clamp(0.5*grid*bright,0.,1.);
    bright=1.-bright;

    return bright;
}




//can use the geometry.glsl file here if we want
//can use geometry in here if we would like to!
//its included first
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{


    //rescale to live in unit square;
    vec2 sq=fragCoord/res;

    //now scale correctly
    float t=2.*PI*sq.x;
    float s=2.*PI*sq.y;


    float rad=0.8;
    float ang=sq.x;
    vec3 color1=hsb2rgb(vec3(ang, 0.7, 0.3));

    //get brightness from domain:
    float tLines=sin(5.*t);
    float sLines=sin(5.*(2.*s-t));
    float bright=-log(abs(sLines));
    bright=clamp(0.5*grid*bright,0.,1.);
    bright=1.-bright;

    //give color 1 except in black lines:
    color1*=bright;

    vec3 ivory=0.2*bright*vec3(255, 253, 180)/255.;
    //255, 253, 208)/255.;

    //now, make a second color only in those lines:
    bright=1./bright-1.;
    bright=clamp(bright,0.,1.);

    vec3 color2=hsb2rgb(vec3(ang, 0.7, 0.15));
    color2*=bright;

    vec3 totalColor=color1+color2;

    vec3 color=(1.-hue)*ivory+hue*totalColor;

    fragColor=vec4(color, 1);

}












void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
