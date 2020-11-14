uniform float time;
uniform sampler2D map;
varying vec2 vUv;

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

    float t = time + random(gl_PointCoord.xy) * 100.0;
    gl_FragColor = texture2D(map, vUv ) * max(abs(sin(t / 100.0)), 0.5);

    //gl_FragColor = texture2D ( map, vUv );
    //gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}