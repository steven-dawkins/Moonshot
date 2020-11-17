uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 pos;

void main()	{
    vUv = uv;
    pos = position;
    gl_Position = vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}