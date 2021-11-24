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


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    //rescale to live in unit square;
    vec2 sq=fragCoord/res;

    //scale to the domain
    vec2 rBounds;
    vec2 dom=setDomain(sq,rBounds);
    float rMin=rBounds.x;
    float rMax=rBounds.y;
    float r=dom.x;
    float t=dom.y;

    //apply the function
    vec2 codom=znPolar(dom.x,dom.y);
    float R=codom.x;
    float T=codom.y;

   //get color from codomain
    vec3 codColor=complexColor(vec2(R,T),rBounds);

    //get brightness from domain:
    float bright=coordLines(dom);

    //choose a plain color
    vec3 ivory=0.2*bright*vec3(255, 253, 180)/255.;
    //    //255, 253, 208)/255.;

    //combine and ouput the colors
    vec3 color=(1.-hue)*ivory+hue*codColor;
    fragColor=vec4(bright*color, 1);

}











void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
