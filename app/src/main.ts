import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CelestialObject, Trajectory } from "./CelestialObject";

import planetInfo from "./planetInfo.json";

// import { CelestialObject, Trajectory } from "./CelestialObject.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);

// Create a loading manager
const loadingManager = new THREE.LoadingManager();

const pngLoader = new THREE.TextureLoader(loadingManager);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);


document.body.appendChild(renderer.domElement);

pngLoader.load("/textures/starmap-warped.png", function (texture : THREE.Texture) {
	texture.mapping = THREE.EquirectangularReflectionMapping;

	// Set the loaded EXR as the scene background
	scene.background = texture;

}, undefined, function (error) {
	console.error('Error loading PNG:', error); // Log any errors
});

// Load the texture for the sun
const textureLoader = new THREE.TextureLoader(loadingManager);

const sunTexture = textureLoader.load('textures/sun_texture.jpg');
const mercuryTexture = textureLoader.load('textures/Mercury.jpg');
const venusTexture = textureLoader.load('textures/Venus.jpg');
const earthTexture = textureLoader.load('textures/Earth.jpg');
const marsTexture = textureLoader.load('textures/Mars.jpg');
const asteroidTexture = textureLoader.load('textures/Asteroid.jpg');
const jupiterTexture = textureLoader.load('textures/Jupiter.jpg');
const saturnTexture = textureLoader.load('textures/Saturn.jpg');
const saturnRingTexture = textureLoader.load('textures/Saturn Ring.png');
const uranusTexture = textureLoader.load('textures/Uranus.jpg');
const neptuneTexture = textureLoader.load('textures/Neptune.jpg');

// Create a sphere geometry and apply the sun texture
const sunFactor = 15; // radius of the sun, used to set the scale of other planets
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshStandardMaterial({ map: sunTexture });
const sunSphere = new THREE.Mesh(geometry, material);
sunSphere.position.set(0, 0, 0);
sunSphere.name = "Sun";
// Add the sun sphere to the scene
scene.add(sunSphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);

// Add point light (like sunlight)
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Function to create a planet
function createPlanet(size: number, distance: number, name: string, texture : THREE.Texture) {
	const geometry = new THREE.SphereGeometry(size, 32, 32);
	const material = new THREE.MeshStandardMaterial({ map: texture });
	const planet = new THREE.Mesh(geometry, material);
	planet.position.set(distance, 0, 0);
	planet.name = name;
	
	return planet;
}

const mercuryTrajectory = new Trajectory("Mercury", 0.38709893, 7.00487, 29.124, 0.20563069, 48.33167, 174.796, 0.240846);
const venusTrajectory = new Trajectory("Venus", 0.72333199, 3.39471, 54.9, 0.00677323, 76.7, 181.98, 0.615);
const earthTrajectory = new Trajectory("Earth", 1, 0.00005, 102.94719, 0.01671022, 0, 100.47, 1);
const marsTrajectory = new Trajectory("Mars", 1.52366231, 1.85061, 286.5, 0.09339, 49.57854, 355.43, 1.881);
const jupiterTrajectory = new Trajectory("Jupiter", 5.20336301, 1.30530, 273.867, 0.04839266, 100.55615, 34.40438, 11.862);
const saturnTrajectory = new Trajectory("Saturn", 9.53707032, 2.48446, 339.392, 0.05415060, 113.6624, 49.94432, 29.457);
const uranusTrajectory = new Trajectory("Uranus", 19.19126393, 0.76986, 98.998, 0.04716771, 74.016925, 313.23218, 84.016);
const neptuneTrajectory = new Trajectory("Neptune", 30.06896348, 1.76917, 276.340, 0.00858587, 131.784057, 304.88003, 164.791);

const mercuryCO = new CelestialObject(mercuryTrajectory, 0.003504*sunFactor, mercuryTexture);
const venusCO = new CelestialObject(venusTrajectory, 0.008691*sunFactor, venusTexture);
const earthCO = new CelestialObject(earthTrajectory, 0.009149*sunFactor, earthTexture);
const marsCO = new CelestialObject(marsTrajectory, 0.004868*sunFactor, marsTexture);
const jupiterCO = new CelestialObject(jupiterTrajectory, 0.100398*sunFactor, jupiterTexture);
const saturnCO = new CelestialObject(saturnTrajectory, 0.083626*sunFactor, saturnTexture);
const uranusCO = new CelestialObject(uranusTrajectory, 0.036422*sunFactor, uranusTexture);
const neptuneCO = new CelestialObject(neptuneTrajectory, 0.035359*sunFactor, neptuneTexture);

mercuryCO.traceOrbits(scene);
mercuryCO.createPlanet(scene);

venusCO.traceOrbits(scene);
venusCO.createPlanet(scene);

earthCO.traceOrbits(scene);
earthCO.createPlanet(scene);

marsCO.traceOrbits(scene);
marsCO.createPlanet(scene);

// Asteroid Belt (Shaped like a ring)
function createAsteroidBelt() {
	const group = new THREE.Group();
	const beltRadius = 6;
	const beltWidth = 1.5;
	const numAsteroids = 800;

	for (let i = 0; i < numAsteroids; i++) {
		const angle = Math.random() * Math.PI * 2;
		const radius = beltRadius + (Math.random() - 0.5) * beltWidth;
		const asteroid = createPlanet(0.02, radius, "Asteroid", asteroidTexture);
		// Add random height variation to the y-position
        const yOffset = (Math.random() - 0.5);
		asteroid.position.set(
			Math.cos(angle) * radius,
			yOffset,
			Math.sin(angle) * radius
		);
		group.add(asteroid);
	}
	return group;
}
const asteroidBelt = createAsteroidBelt();
scene.add(asteroidBelt);

jupiterCO.traceOrbits(scene);
jupiterCO.createPlanet(scene);

saturnCO.traceOrbits(scene);
saturnCO.createPlanet(scene);

function createRing(planet: THREE.Mesh, innerRadius: number, outerRadius: number, name: string, texture : THREE.Texture) {
	const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
	const ringMaterial = new THREE.MeshBasicMaterial({ map: texture });
	const ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.rotation.x = Math.PI / 2;
	ring.name = name;
	planet.add(ring);
}
createRing(saturnCO.getPlanetMesh(), 0.2, 0.35, "Saturn Ring", saturnRingTexture);  // Adding Saturn's ring

uranusCO.traceOrbits(scene);
uranusCO.createPlanet(scene);

neptuneCO.traceOrbits(scene);
neptuneCO.createPlanet(scene);


function updateSpeed(value : string) {
	CelestialObject.setSimSpeed(parseFloat(value));
	const speedDisplay = document.getElementById('speedValue');
	if (speedDisplay) {
		speedDisplay.textContent = CelestialObject.getSimSpeed().toString();
	}
}

function updateDate() {
	const dateDisplay = document.getElementById('dateValue');
	if (dateDisplay) {
		dateDisplay.textContent = CelestialObject.getEpoch();
	}
}

// Add event listener for the slider when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
	const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
  
	if (speedSlider) {
	  speedSlider.oninput = () => updateSpeed(speedSlider.value);
	}
});

function cameraFollow(planet : THREE.Intersection) {
	camera.position.set(planet.object.position.x + 1, planet.object.scale.y + 1, planet.object.scale.z + 1);
	camera.lookAt(planet.object.position);
}

// Click detection setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', onMouseClick, false);

let infoWindowOpen : boolean = false;
let curPlanet : THREE.Intersection | null = null;

function onMouseClick(event: MouseEvent) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the ray
  const objs = [sunSphere, mercuryCO.getPlanetMesh(), venusCO.getPlanetMesh(), earthCO.getPlanetMesh(), marsCO.getPlanetMesh(), asteroidBelt, jupiterCO.getPlanetMesh(), saturnCO.getPlanetMesh(), uranusCO.getPlanetMesh(), neptuneCO.getPlanetMesh()];
  const intersects = raycaster.intersectObjects(objs, true);

  if (intersects.length > 0) {
	// Show the info window
	const infoWindow = document.getElementById('infoWindow');
	curPlanet = intersects[0];
	
	// camera.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z + 5);
	// camera.lookAt(intersects[0].object.position);
	// camera.position.z = intersects[0].object.scale.z * 1.5;
	
	if (infoWindow && infoWindowOpen === false) {
	  infoWindowOpen = true;
	  infoWindow.style.display = 'block';
	  infoWindow.getElementsByClassName("infoTitle")[0].textContent = intersects[0].object.name;

	  const name = intersects[0].object.name as keyof typeof planetInfo;
	  const planet = planetInfo[name];
	  infoWindow.getElementsByClassName("diameterText")[0].textContent = "Diameter: " + planet.diameter;
	  infoWindow.getElementsByClassName("massText")[0].textContent = "Mass: " + planet.mass;
	  infoWindow.getElementsByClassName("distanceText")[0].textContent = "Distance from Sun: " + planet.distance;
	  infoWindow.getElementsByClassName("tempText")[0].textContent = "Temperature: " + planet.temperature;
	  infoWindow.getElementsByClassName("gravityText")[0].textContent = "Gravity: " + planet.gravity;
	  infoWindow.getElementsByClassName("infoText1")[0].textContent = planet.info1;
	  infoWindow.getElementsByClassName("infoText2")[0].textContent = planet.info2;
	}
  }
}

// Close button functionality
const closeButton = document.getElementById('closeButton');
if (closeButton) {
  closeButton.addEventListener('click', () => {
	const infoWindow = document.getElementById('infoWindow');
	if (infoWindow) {
	  infoWindow.style.display = 'none';
	  infoWindowOpen = false;
	  curPlanet = null;
	  camera.position.set(0, 2.5, 4);
	}
  });
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate() {
	if (curPlanet) {
		cameraFollow(curPlanet);
	}
	updateDate();
	CelestialObject.updatePosition(scene);
	renderer.render( scene, camera );
}

// Set up a callback for when loading is complete
loadingManager.onLoad = () => {
    console.log('All textures loaded!');
	// Hide the loading screen
	const loadingScreen = document.getElementById('loadingScreen');
	if (loadingScreen) {
		loadingScreen.style.display = 'none';
	}

	// Show the main content
	const mainContent = document.getElementById('mainContent');
	if (mainContent) {
		mainContent.style.display = 'block';
	}
    // Now you can start rendering the scene
	renderer.setAnimationLoop( animate );
};

// Set up a callback for when an item is loaded
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loaded ${url}.`);
	document.getElementById('loadingText')!.textContent = `Loaded ${itemsLoaded} of ${itemsTotal}`;
	document.getElementById('loadingBar')!.style.width = `${Math.round((itemsLoaded / itemsTotal) * 100)}%`;
	document.getElementById('loadingBar')!.textContent = `${Math.round((itemsLoaded / itemsTotal) * 100)}%`;
};

// Set up a callback for when an item is loaded with an error
loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};

function handleWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);