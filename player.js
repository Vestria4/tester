import * as THREE from 'https://cdn.skypack.dev/three@v0.132.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.132.0/examples/jsm/controls/OrbitControls.js';
import { SGMLoader } from './sgmLoader.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');
const playerInfo_Url = `https://api.slin.dev/grab/v1/get_user_info?user_id=${userId}`;
const picker = document.getElementById('categories-content');
const item_api = await fetch('https://api.slin.dev/grab/v1/get_shop_items?version=1');
const items = await item_api.json();
let catalogResponse = await fetch('https://api.slin.dev/grab/v1/get_shop_catalog?version=1');
let catalogResponseBody = await catalogResponse.json();
let playerPrim_Color;
let playerSec_Color;
let visorColor;
let selectedPrimaryDiv;
let primaryOpened;
let selectedSecondaryDiv;
let secondaryOpened;
let files = {};
let backTracker;
let clonedGroup;
let activeCosmetics = {
  'Heads': undefined,
  'Hats': undefined,
  'Facewear': undefined,
  'Hands': undefined,
  'Checkpoints': undefined,
  'Grapples': undefined,
  'Body': undefined
};

function ConvertHSVToRGB(h, s, v, alpha) {
  let hi = h * 3.0 / Math.PI;
  const f = hi - Math.floor(hi);

  if (hi >= 3.0)
    hi -= 6.0;
  if (hi < -3.0)
    hi += 6.0;

  let r = Math.max(v, 0.0);
  let g = Math.max(v - s * v, 0.0);
  let b = Math.max(v - s * f * v, 0.0);
  let a = Math.max(v - s * (1.0 - f) * v, 0.0);

  if (hi < -2.0) {
    return { r: r, g: a, b: g, a: alpha };
  }
  else if (hi < -1.0) {
    return { r: b, g: r, b: g, a: alpha };
  }
  else if (hi < 0.0) {
    return { r: g, g: r, b: a, a: alpha };
  }
  else if (hi < 1.0) {
    return { r: g, g: b, b: r, a: alpha };
  }
  else if (hi < 2.0) {
    return { r: a, g: g, b: r, a: alpha };
  }
  else {
    return { r: r, g: g, b: b, a: alpha };
  }
}

function GetColor(row, column) {
  let color;
  if (row === 0) {
    return color = ConvertHSVToRGB(0.0, 0.0, 1.0 - column / 10.0);
  }
  if (row <= 5 && row != 0) {
    return color = ConvertHSVToRGB(2.0 * Math.PI * column / 10.0, 1.0, row / (10.0 - 4.0));

  }
  else {
    return color = ConvertHSVToRGB(2.0 * Math.PI * column / 10.0, 1.0 - (row - 5.0) / (10.0 - 5.0), 1.0);
  }
}

function LinearToGamma(color) {
  let r = color.r;
  let g = color.g;
  let b = color.b;

  if (r <= 0.0031308) {
    r = r * 12.92;
  }
  else {
    r = 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055;
  }

  if (g <= 0.0031308) {
    g = g * 12.92;
  }
  else {
    g = 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055;
  }

  if (b <= 0.0031308) {
    b = b * 12.92;
  }
  else {
    b = 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055;
  }

  return { r: r, g: g, b: b, a: color.a };
}

function createScenes() {
  // Create scenes, load models, etc.
  // ...

  // Example: Create a scene and add it to the scenes array
  const scene2 = new THREE.Scene();
  scene2.userData.element = document.getElementById('scene2');
  scene2.userData.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  // Add models, lights, etc. to scene2
  scene2.add(new THREE.AmbientLight(0xffffff));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  scene2.add(light);
  scenes.push(scene2);
  // ...
}

function updateSize() {
  // Update size logic
  // ...
}

function renderLoop() {
  // Render loop logic
  // ...
}

function animates() {
  // Animation logic
  // ...
}

function render() {
  // Rendering logic
  // ...
}

function changeMeshColors(primaryColor, secondaryColor, visorColor_) {
  // Change mesh colors logic
  // ...
}

function init() {
  // Initialization logic
  createScenes();
  animates();
}

// Initializations
init();

// Event listener example for color changes
document.getElementById('colorPicker').addEventListener('change', function () {
  const selectedColor = this.value;
  changeMeshColors(new THREE.Color(selectedColor), null, null);
});

// Event listener example for user interaction
document.getElementById('userInteraction').addEventListener('click', function () {
  console.log('User clicked on the interactive element.');
});

// ... (Any additional code or event listeners)

