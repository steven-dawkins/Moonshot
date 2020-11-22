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
    float x = mod(time + gl_FragCoord.x, 30.) / 30.;
    float y = mod(time + gl_FragCoord.y, 30.) / 30.;
    //float r = distance(vec2(x,y), vec2(0.,0.)) / 20.;
    float r = (abs(x * x * x) + abs(y * y * y)) / 1000.;
    gl_FragColor = vec4(1. - r, 0., 0., 1.);
    
    gl_FragColor = texture2D(map, vec2(x,y) );

    //gl_FragColor = texture2D(map, gl_PointCoord );

    //float t = time + floor(random(gl_FragCoord.xy / 600.0) * 100.0);
    float t = time + random(vec2(offset, offset)) * 1000.0;

    float intensity = max(sin(t / 20.0), 0.0);
    intensity = intensity * intensity * intensity * intensity;
    intensity = 1.0 - intensity;
    //float t = 0.0;
    gl_FragColor = texture2D(map, vUv ) * max(intensity, 0.5);
    //gl_FragColor.r = gl_FragCoord.z * 255.0 / 400.0;
    //gl_FragColor.r = 255.0;
    // gl_FragColor.r = 0.0;
    // gl_FragColor.a = 255.0;
    // gl_FragColor.g = 0.0;
    // gl_FragColor.b = 0.0;
    // //gl_FragColor.r = random(gl_FragCoord.xy) * 1.0;
    // gl_FragColor.a = 1.0;

    //gl_FragColor = texture2D ( map, vUv );
    //gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}