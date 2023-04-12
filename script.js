
let canvas = undefined,
scene = undefined,
camera = undefined,
renderer = undefined,
material = undefined,
mesh = undefined,
mouse = undefined,
targetMouse = undefined,
mouseOver = false,
resolution = undefined,
tick = undefined;


function init() {
  tick = Math.round(Math.random() * 5000);
  mouse = [0, 0];
  targetMouse = [0.5, 0.5];
  resolution = [window.innerWidth, window.innerHeight];
  canvas = document.getElementById("canvas");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.z = 1;
  
  function reactive_header_gl(color1, color2) {
  var uniforms = {
    time: {
      type: "f",
      value: 0.0 },

    resolution: {
      type: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    
    color1: { 
      type: "c",
      value: new THREE.Color(color1) },
    color2: { 
      type: "c",
      value: new THREE.Color(color2) },

    mouse: {
      type: "v2",
      value: new THREE.Vector2(0, 0) } 
    };

  material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `	uniform float time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    uniform vec3 color1;
    uniform vec3 color2;
  
    void main() 
    {
      gl_Position = vec4(position, 1.0);
    }`,
    fragmentShader: `
    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
    }
  
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
  
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
  
  
    //precision mediump float;
  
  
    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
  
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
  
      vec4 gx0 = ixy0 * (1.0 / 7.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  
      vec4 gx1 = ixy1 * (1.0 / 7.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110= vec3(gx0.w,gy0.w,gz0.w); 
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); 
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y); 
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); 
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }
    
    uniform float time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    
    float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9858,78.233))) * 454558.559091); }
    
    void main() 
    {
      vec2 pos, res;
      float mDist, n, r, g, b, grain;
      
      res = gl_FragCoord.xy / 802.0;
      pos = gl_FragCoord.xy / resolution.xy;
    
      mDist = 1.0 - distance(pos, mouse);
    
     n = abs(cnoise(vec3(res, time * 8.0 ))) * mDist;
      //n = abs(snoise3(vec3(res * 10.0, time * 0.1))) * mDist;
    
      for (float i = 1.0; i <= 1.85; i++) {
        float p = pow(i, 2.0);
        n += abs(cnoise(p * (n + vec3(res, n + time))) / p) * mDist;
      }
      
    
      r = abs(sin(n)) * mDist * color2.r * 2.0;
      // b = 0.6 * r;
      g = mix(b, r, mDist);
    
    
    
      g = mix(color1.g, color2.g, 0.5 + 0.5 * sin(4.0 - n * 8.0)); 
      b = mix(color1.b, color2.b, 0.5 + 0.5 * sin(4.0 - n * 8.0));
    
      
      grain = cnoise(vec3(gl_FragCoord.xy * 1.28, time)) * 0.1;
      r += grain;
      g += grain;
      b += grain;
    
      gl_FragColor = vec4(vec3(r*2.0, g*1.0, b*1.5).rgb, 1.0);
      
    }`
   }); 
  }

  reactive_header_gl('#e4ff00', '#ffa510'); //Change the colors here

  mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  scene.add(mesh);
  renderer = new THREE.WebGLRenderer({
    canvas });

  resize();
  window.addEventListener("resize", resize);
  canvas.addEventListener("mousemove", mouseHandler);
  canvas.addEventListener("mouseleave", mouseHandler);
}

function render() {
  tick++;

 const speed = material.uniforms['time'].value = 0.000055 * tick;

  lerpArrays(mouse, targetMouse, 0.00285 / speed);

  material.uniforms['mouse'].value.x = mouse[0];
  material.uniforms['mouse'].value.y = mouse[1];
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

function lerpArrays(from, to, amount) {
  from[0] = (1 - amount) * from[0] + amount * to[0];
  from[1] = (1 - amount) * from[1] + amount * to[1];
}

function distance(from, to) {
  return Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2));
}

function angle(from, to) {
  return Math.atan(from[1] - to[1], from[0] - to[0]);
}

function mouseHandler(e) {
  if (e.type === "mousemove") mouseOver = true;
  if (e.type === "mouseleave") mouseOver = false;
  if (mouseOver) {
    targetMouse = [e.clientX / resolution[0], (resolution[1] - e.clientY) / resolution[1]];
  } else {
    targetMouse = [0.5, 0.5];
  }
}

function resize() {
  material.uniforms["resolution"].value.x = resolution[0] = window.innerWidth;
  material.uniforms["resolution"].value.y = resolution[1] = window.innerHeight;
  camera.aspect = 0.5;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  // TODO: Update to handle retina display
  renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener("load", function () {
  init();
  render();
});
