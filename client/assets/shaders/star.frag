uniform float time;
uniform float offset;
uniform sampler2D map;
varying vec2 vUv;
varying vec2 vPosition;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()	{
    float t = time + random(vec2(offset, offset)) * 1000.0;

    float intensity = max(sin(t / 20.0), 0.0);
    intensity = intensity * intensity * intensity * intensity;
    intensity = 1.0 - intensity;
    
    gl_FragColor = texture2D(map, vUv ) * max(intensity, 0.5);
}