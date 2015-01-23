#version 120

#pragma include "Shaders/Common/ShaderHelpers.glslinc"
#pragma include "Shaders/Common/Noise2D.glslinc"
#pragma include "Shaders/Common/Noise3D.glslinc"
#pragma include "Shaders/Common/Noise4D.glslinc"

uniform float time;

uniform float mouseX;	// normalized mouse coordinates
uniform float mouseY;

uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;

uniform float shininess; // let the material handle this? I guess once we have lighting going 

varying vec3 normal;
varying vec3 eyeDir;
varying vec3 lightDir;
varying vec3 modelSpaceVertex;

float pattern(in vec2 p) {
    float l = 2.5;
    float g = 0.4;
    int oc = 10;
    
    vec2 q = vec2( fbm( p + vec2(0.0,0.0),oc,l,g),fbm( p + vec2(5.2,1.3),oc,l,g));
    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2),oc,l,g ), fbm( p + 4.0*q + vec2(8.3,2.8) ,oc,l,g));
    return fbm( p + 4.0*r ,oc,l,g);    
}

void main()
{
	vec2 texCoord = gl_TexCoord[0].st;
	
	vec4 color = vec4( 1.0, 1.0, 1.0, 1.0 );
	//color.x = map( sin(texCoord.x * 0.01), -1, 1,  0, 1 );
	//color.y = map( cos(texCoord.y * 0.01), -1, 1,  0, 1 );

	//color.x = map( sin( time + texCoord.t * (240.0 * mouseX) ), -1, 1,  1, 0 );
	//color.y = map( sin( time + texCoord.s * (200.0 * mouseY) ), -1, 1,  1, 0 );

	//color.x = snoise( modelSpaceVertex.xyz * mouseX );
	//color.y = snoise( modelSpaceVertex.yxz * mouseY );

	float mixNoiseVal = map( snoise( modelSpaceVertex.xyz * mouseX * 10.0 ), -1, 1, 0, 1);
	mixNoiseVal = linearStepInOut( 0.4, 0.6, 0.7, 0.8, mixNoiseVal );	

	//float patternNoiseVal = map( fbm_3oct( modelSpaceVertex.xyz * mouseY * 10.0 ), -1, 1, 0, 1);
	float patternNoiseVal = map( fbm_5oct( modelSpaceVertex.xyz * mouseY * 5.0 ), -1, 1, 0, 1);	
	
	// Marble
	
	//vec3 p = modelSpaceVertex.xyz * vec3(40.0, map( mouseX, 0, 1,  0.01, 10 ), 80 );
	vec3 p = modelSpaceVertex.xyz * vec3(30, 30, 30 );	
	//float angle = (p.x + p.y + p.z) * fbm_5oct( modelSpaceVertex.xyz * map( mouseY, 0, 1, 0, 5.0) );
	float angle = (p.x + p.y, p.z ) * fbm( modelSpaceVertex.xyz * map( mouseY, 0, 1, 0, 5.0), 20, 2.0, 0.5 );	
	float tmpMarbleVal = map( sin( angle ), -1, 1,  0, 1 );
	color.xyz = mix( color1.xyz, color2.xyz, tmpMarbleVal );
	
	// End Marble

	// Granite
	/*
 	//float noiseVal   = snoise( modelSpaceVertex.xyz * mouseX * 100.0 );
 	float noiseVal   = fbm( modelSpaceVertex.xyz * mouseX * 6.0, 7, 2.0, 0.5 ); 
 	//noiseVal = map( noiseVal, -1.0, 1.0, 0.0, 1.0 );	
   	float intensity = min(1.0, noiseVal * 5.3);
   	color.xyz = vec3(intensity * 1.0 );
   	*/
	// End Granite

	// Sun (Not working)
	//float noiseVal = fbm( modelSpaceVertex.xyz * mouseX * 6.0, 7, 2.0, 0.5 ); 
	/*
	vec3 p = modelSpaceVertex.xyz * mouseX * 20.0;

	float noiseVal = abs(snoise(p) 	     - 0.25) +
                     abs(snoise(p * 2.0) - 0.125) +
                     abs(snoise(p * 4.0) - 0.0625) +
                     abs(snoise(p * 8.0) - 0.03125); 

	noiseVal = clamp(noiseVal * 6.0, 0.0, 1.0);
	color.xyz = mix(color1.xyz, color2.xyz, noiseVal) * (1.0);
	*/

	/*
uniform sampler3D Noise;
uniform vec3  Color1;
uniform vec3  Color2;
uniform float NoiseScale;
out vec4 FragColor;
void main() {
// (0.8, 0.7, 0.0)
// (0.6, 0.1, 0.0)
// 1.2
   vec4 noisevec = texture(Noise, MCposition * NoiseScale);
   float intensity = abs(noisevec[0] - 0.25) +
                     abs(noisevec[1] - 0.125) +
                     abs(noisevec[2] - 0.0625) +
                     abs(noisevec[3] - 0.03125);
   intensity = clamp(intensity * 6.0, 0.0, 1.0);
   vec3 color = mix(Color1, Color2, intensity) * LightIntensity;
   FragColor = vec4(color, 1.0);
}

	*/

	// End Sun

	//color.xyz = vec3(mixNoiseVal);
	//color.xyz = vec3(patternNoiseVal);
	//color.xyz = vec3(tmpMarbleVal);	

	//color.xyz = mix( vec3(patternNoiseVal), vec3(0.0), 1.0-mixNoiseVal );
	//color.xyz = mix( vec3(patternNoiseVal), vec3(0.0), 1.0-mixNoiseVal );

	//color = color1;

	//gl_FragColor = vec4( mouseX, mouseY, 1.0, 1.0);
	//gl_FragColor = vec4( normal, 1.0);
	//gl_FragColor = vec4( texCoord.st, 1.0, 1.0);


	gl_FragColor = color;
}