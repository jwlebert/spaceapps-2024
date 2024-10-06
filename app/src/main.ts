import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { CelestialObject, Trajectory } from "./CelestialObject";
import data from "./comets.json";
import planetInfo from "./planetInfo.json";

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

pngLoader.load("/textures/starmap-warped.png", function (texture: THREE.Texture) {
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
const sunFactor = 1; // radius of the sun, used to set the scale of other planets
const geometry = new THREE.SphereGeometry(sunFactor * 0.5, 32, 32);
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

3// Function to create a planet
function createPlanet(size: number, distance: number, name: string, texture: THREE.Texture) {
	const geometry = new THREE.SphereGeometry(size, 32, 32);
	const material = new THREE.MeshStandardMaterial({ map: texture });
	const planet = new THREE.Mesh(geometry, material);
	planet.position.set(distance, 0, 0);
	planet.name = name;

	return planet;
}

var epoch = new Date('December 9, 2014');  // start the calendar 
var simSpeed = 0.75;                        // value from the scroll control

const mercuryTrajectory = new Trajectory("Mercury", 0.38709893, 7.00487, 29.124, 0.20563069, 48.33167, 174.796, 0.240846);
const venusTrajectory = new Trajectory("Venus", 0.72333199, 3.39471, 54.9, 0.00677323, 76.7, 181.98, 0.615);
const earthTrajectory = new Trajectory("Earth", 1, 0.00005, 102.94719, 0.01671022, 0, 100.47, 1);
const marsTrajectory = new Trajectory("Mars", 1.52366231, 1.85061, 286.5, 0.09339, 49.57854, 355.43, 1.881);
const jupiterTrajectory = new Trajectory("Jupiter", 5.20336301, 1.30530, 273.867, 0.04839266, 100.55615, 34.40438, 11.862);
const saturnTrajectory = new Trajectory("Saturn", 9.53707032, 2.48446, 339.392, 0.05415060, 113.6624, 49.94432, 29.457);
const uranusTrajectory = new Trajectory("Uranus", 19.19126393, 0.76986, 98.998, 0.04716771, 74.016925, 313.23218, 84.016);
const neptuneTrajectory = new Trajectory("Neptune", 30.06896348, 1.76917, 276.340, 0.00858587, 131.784057, 304.88003, 164.791);

const mercuryCO = new CelestialObject(mercuryTrajectory, bodies, scene, 0.003504 * sunFactor, mercuryTexture);
const venusCO = new CelestialObject(venusTrajectory, bodies, scene, 0.008691 * sunFactor, venusTexture);
const earthCO = new CelestialObject(earthTrajectory, bodies, scene, 0.009149 * sunFactor, earthTexture);
const marsCO = new CelestialObject(marsTrajectory, bodies, scene, 0.004868 * sunFactor, marsTexture);
const jupiterCO = new CelestialObject(jupiterTrajectory, bodies, scene, 0.100398 * sunFactor, jupiterTexture);
const saturnCO = new CelestialObject(saturnTrajectory, bodies, scene, 0.083626 * sunFactor, saturnTexture);
const uranusCO = new CelestialObject(uranusTrajectory, bodies, scene, 0.036422 * sunFactor, uranusTexture);
const neptuneCO = new CelestialObject(neptuneTrajectory, bodies, scene, 0.035359 * sunFactor, neptuneTexture);

const bodies: CelestialObject[] = [];
const cometTexture = textureLoader.load('textures/Asteroid.jpg');

for (const obj of data) {
	const name = obj.name;
	const eccentricity = obj.e;
	const ascNode = obj.node * 0.01745329;
	const orbInc = obj.i* 0.01745329;
	const argPeri = obj.w * 0.01745329;
	const periodYr = obj.per_y;
	const semiMajAxis = obj.a;
	const meanAnom = obj.ma;

	const trajectory = new Trajectory(name, semiMajAxis, orbInc, argPeri, eccentricity, ascNode, meanAnom, periodYr);
	const cometsCO = new CelestialObject(trajectory, bodies, scene, 0.05, cometTexture, "comet");
}

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

function createRing(planet: THREE.Mesh, innerRadius: number, outerRadius: number, name: string, texture: THREE.Texture) {
	const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
	const ringMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
	const ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.rotation.x = Math.PI / 2 - 0.5;
	ring.rotation.z = Math.PI / 2 - 0.5;
	ring.name = name;
	planet.add(ring);
}
createRing(saturnCO.mesh, 0.2, 0.35, "Saturn Ring", saturnRingTexture);  // Adding Saturn's ring

function updateSpeed(value: string) {
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

const planets = ["None", sunSphere, mercuryCO, venusCO, earthCO, marsCO, jupiterCO, saturnCO, uranusCO, neptuneCO];
const planetNames = ["None", "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
let selectedPlanet: number = 0;
// Add event listener for the slider when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
	const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;

	if (speedSlider) {
		speedSlider.oninput = () => updateSpeed(speedSlider.value);
	}

	const nextButton = document.getElementById('nextPlanet');
	const prevButton = document.getElementById('prevPlanet');

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			const nextPlanet = planets[(selectedPlanet + 1) % planets.length];
			selectedPlanet = (selectedPlanet + 1) % planets.length;
			if (nextPlanet instanceof CelestialObject) {
				curPlanet = nextPlanet.getPlanetMesh();
			} else if (selectedPlanet == 1 && nextPlanet instanceof THREE.Object3D) {
				curPlanet = nextPlanet;
			} else {
				curPlanet = null;
				camera.position.set(0, 2.5, 4);
			}
			const infoWindow = document.getElementById('infoWindow');
			if (infoWindow && infoWindowOpen === true) {
				infoWindow.style.display = 'none';
				infoWindowOpen = false;
			}
		});
	}

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			const prevPlanet = planets[(selectedPlanet - 1 + planets.length) % planets.length];
			selectedPlanet = (selectedPlanet - 1 + planets.length) % planets.length;
			if (prevPlanet instanceof CelestialObject) {
				curPlanet = prevPlanet.getPlanetMesh();
			} else if (selectedPlanet == 1 && prevPlanet instanceof THREE.Object3D) {
				curPlanet = prevPlanet;
			} else {
				curPlanet = null;
				camera.position.set(0, 2.5, 4);
			}
			const infoWindow = document.getElementById('infoWindow');
			if (infoWindow && infoWindowOpen === true) {
				infoWindow.style.display = 'none';
				infoWindowOpen = false;
			}
		});
	}

	const resetSimulation = document.getElementById('resetSim');
	if (resetSimulation) {
		resetSimulation.addEventListener('click', () => {
			window.location.reload();
		});
	}

	const resetCamera = document.getElementById('resetCamera');
	if (resetCamera) {
		resetCamera.addEventListener('click', () => {
			camera.position.set(0, 2.5, 4);
		});
	}
});

function cameraFollow(planet: THREE.Object3D) {
	const angleRadians = Math.atan2(planet.position.z, planet.position.x);
	if (planet.name === "Sun") {
		camera.position.set(planet.position.x, planet.position.y + 1, planet.position.z + 1);
	} else {
		camera.position.set(planet.position.x + Math.cos(angleRadians) * 0.3, planet.position.y, planet.position.z + Math.sin(angleRadians) * 0.3);
	}
	camera.lookAt(sunSphere.position);
}


let infoWindowOpen: boolean = false;
let curPlanet: THREE.Object3D | null = null;

function displayInfoWindow() {
	// Show the info window
	const infoWindow = document.getElementById('infoWindow');

	if (infoWindow && infoWindowOpen === false) {
		infoWindowOpen = true;
		infoWindow.style.display = 'block';
		infoWindow.getElementsByClassName("infoTitle")[0].textContent = planetNames[selectedPlanet];

		const name = planetNames[selectedPlanet] as keyof typeof planetInfo;
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

// Close button functionality
const closeButton = document.getElementById('closeButton');
if (closeButton) {
	closeButton.addEventListener('click', () => {
		const infoWindow = document.getElementById('infoWindow');
		if (infoWindow) {
			infoWindow.style.display = 'none';
			infoWindowOpen = false;
			selectedPlanet = 0;
			curPlanet = null;
			camera.position.set(0, 2.5, 4);
		}
	});
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
const planetText = document.getElementById('planetText');


function animate() {
	if (curPlanet) {
		cameraFollow(curPlanet);
		displayInfoWindow();
	}
	if (planetText && planetText.textContent !== planetNames[selectedPlanet]) {
		planetText.textContent = planetNames[selectedPlanet];
	}
  
	bodies.forEach(body => {
		body.updatePosition(simSpeed);
	})
	CelestialObject.updateTheDate(epoch, simSpeed);
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
	renderer.setAnimationLoop(animate);
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