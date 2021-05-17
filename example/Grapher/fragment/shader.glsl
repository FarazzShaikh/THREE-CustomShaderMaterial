uniform float res;
uniform float time;
uniform float grid;
uniform float hue;
uniform float fn;



//Useful functions for determining colors, etc
//stuff that depends on no uniforms

float PI=3.1415926;

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




void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    //rescale to live in unit square;
    vec2 sq=fragCoord/res;

    float baseRad=10.;
    float invPower=1./abs(fn);

    float rMax=pow(baseRad,invPower);
    float rMin;

    if(fn>0.){
        rMin=0.;
    }
    else{//if fn<0
        rMin=pow(1./baseRad,invPower);
    }

    float r=(rMax-rMin)*sq.x+rMin;
    float t=2.*PI*sq.y;

    float R=pow(r,fn);
    float T=fn*t;

    //get the color from the codomain:
    //to rescale radius: find max size
    float maxExtent=max(pow(rMin,fn),pow(rMax,fn));
    float rad=1.2*R/maxExtent;
    float ang=T/(2.*PI);
    vec3 codColor=hsb2rgb(vec3(ang, rad, 0.5));

    //get brightness from domain:
    float rScale=r/rMax;
    float rLines=sin(8.*PI*rScale);
    float tLines=sin(8.*t);
    float bright=-log(abs(rLines))-log(abs(tLines));
    bright=clamp(0.5*grid*bright,0.,1.);
    bright=1.-bright;

    vec3 color=(1.-hue)*vec3(1.)+hue*codColor;

    fragColor=vec4(bright*color, 1);

}










void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
