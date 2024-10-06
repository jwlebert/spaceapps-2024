import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { CelestialObject, Trajectory } from "./CelestialObject";
import data from "./comets.json";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);
// Rotate the camera by 90 degrees around the Z-axis (roll)
camera.rotation.z = Math.PI / 2; // 90 degrees in radians

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
const sunFactor = 1; // radius of the sun, used to set the scale of other planets
const geometry = new THREE.SphereGeometry(sunFactor, 32, 32);
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

var epoch = new Date('December 9, 2014');  // start the calendar 
var simSpeed = 0.75;                        // value from the scroll control

const bodies: CelestialObject[] = [];

const cometTexture = textureLoader.load('textures/Asteroid.jpg');

// console.log(data);

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
	const cometsCO = new CelestialObject(trajectory, bodies, scene, 0.1, cometTexture);
}


const mercuryTrajectory = new Trajectory("Mercury",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const mercuryCO = new CelestialObject(mercuryTrajectory, bodies, scene, 0.003504*sunFactor+1, mercuryTexture);


const venusTrajectory = new Trajectory("Venus",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const venusCO = new CelestialObject(venusTrajectory, bodies, scene, 0.003504*sunFactor+1, venusTexture);

// Earth
const earthTrajectory = new Trajectory("Earth",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const earthCO = new CelestialObject(earthTrajectory, bodies, scene, 0.003504*sunFactor+1, earthTexture);


// Mars
const marsTrajectory = new Trajectory("Mars",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const marsCO = new CelestialObject(marsTrajectory, bodies, scene, 0.003504*sunFactor+1, marsTexture);

// Asteroid Belt (Shaped like a ring)
function createAsteroidBelt() {
	const group = new THREE.Group();
	const beltRadius = 20;
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

// Jupiter (largest planet)
const jupiterTrajectory = new Trajectory("Jupiter",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const jupiterCO = new CelestialObject(jupiterTrajectory, bodies, scene, 0.003504*sunFactor+1, jupiterTexture);

// Saturn with rings
const saturnTrajectory = new Trajectory("Saturn",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const saturnCO = new CelestialObject(saturnTrajectory, bodies, scene, 0.003504*sunFactor+1, saturnTexture);

function createRing(planet: THREE.Mesh, innerRadius: number, outerRadius: number, name: string, texture : THREE.Texture) {
	const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
	const ringMaterial = new THREE.MeshBasicMaterial({ map: texture });
	const ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.rotation.x = Math.PI / 2;
	ring.name = name;
	planet.add(ring);
}
createRing(saturnCO.mesh, 0.2, 0.35, "Saturn Ring", saturnRingTexture);  // Adding Saturn's ring

// Uranus with rings
const uranusTrajectory = new Trajectory("Uranus",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const uranusCO = new CelestialObject(uranusTrajectory, bodies, scene, 0.003504*sunFactor+1, uranusTexture);

// Neptune (last major planet)
const neptuneTrajectory = new Trajectory("Neptune",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615);
const neptuneCO = new CelestialObject(neptuneTrajectory, bodies, scene, 0.003504 * sunFactor + 1, neptuneTexture);

// Click detection setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', onMouseClick, false);

function onMouseClick(event: MouseEvent) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the ray
  const objs = [sunSphere, mercuryCO.mesh, venusCO.mesh, earthCO.mesh, marsCO.mesh, asteroidBelt, jupiterCO.mesh, saturnCO.mesh, uranusCO.mesh, neptuneCO.mesh];
  const intersects = raycaster.intersectObjects(objs, true);

  if (intersects.length > 0) {
	// Show the info window
	const infoWindow = document.getElementById('infoWindow');
	camera.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z + 5);
	camera.lookAt(intersects[0].object.position);
	camera.position.z = intersects[0].object.scale.z * 1.5;
	
	if (infoWindow) {
	  infoWindow.style.display = 'block';
	  infoWindow.getElementsByClassName("infoTitle")[0].textContent = intersects[0].object.name;
	  console.log(infoWindow.getElementsByTagName("h2"));
	  
	  console.log(intersects[0].object.name);
	  
	  console.log('Info window displayed');
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
	}
  });
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate() {
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
	renderer.setAnimationLoop( animate );
};

// Set up a callback for when an item is loaded
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loaded ${url}. Progress: ${itemsLoaded} of ${itemsTotal}`);
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