
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

  var uniforms = {
    time: {
      type: "f",
      value: 0.0 },

    resolution: {
      type: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    
    color1: { 
      type: "c",
      value: new THREE.Color(0x0304a3) },//Change this color1
    color2: { 
      type: "c",
      value: new THREE.Color(0xf0fff0) },//Change this color1

    mouse: {
      type: "v2",
      value: new THREE.Vector2(0, 0) } 
    };




  material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vert-shader").textContent,
    fragmentShader: document.getElementById("frag-shader").textContent });

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

  lerpArrays(mouse, targetMouse, 0.00785 / speed);

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
