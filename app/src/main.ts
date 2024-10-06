import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
const geometry = new THREE.SphereGeometry(1, 32, 32);
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

// Adding Planets with Correct Sizes and Distances (scaled)
const mercury = createPlanet(0.03, 5, "Mercury", mercuryTexture);
scene.add(mercury);

const venus = createPlanet(0.07, 7.5, "Venus", venusTexture);
scene.add(venus);

const earth = createPlanet(0.08, 10, "Earth", earthTexture);
scene.add(earth);

const mars = createPlanet(0.04, 15, "Mars", marsTexture);
scene.add(mars);

// Asteroid Belt (Shaped like a ring)
function createAsteroidBelt() {
	const group = new THREE.Group();
	const beltRadius = 20;
	const beltWidth = 1.5;
	const numAsteroids = 500;

	for (let i = 0; i < numAsteroids; i++) {
		const angle = Math.random() * Math.PI * 2;
		const radius = beltRadius + (Math.random() - 0.5) * beltWidth;
		const asteroid = createPlanet(0.02, radius, "Asteroid", asteroidTexture);
		asteroid.position.set(
			Math.cos(angle) * radius,
			0,
			Math.sin(angle) * radius
		);
		group.add(asteroid);
	}
	return group;
}
const asteroidBelt = createAsteroidBelt();
scene.add(asteroidBelt);

// Jupiter (largest planet)
const jupiter = createPlanet(0.2, 25, "Jupiter", jupiterTexture);
scene.add(jupiter);

// Saturn with rings
const saturn = createPlanet(0.15, 30, "Saturn", saturnTexture);
scene.add(saturn);

function createRing(planet: THREE.Mesh, innerRadius: number, outerRadius: number, name: string, texture : THREE.Texture) {
	const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
	const ringMaterial = new THREE.MeshBasicMaterial({ map: texture });
	const ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.rotation.x = Math.PI / 2;
	ring.name = name;
	planet.add(ring);
}
createRing(saturn, 0.2, 0.35, "Saturn Ring", saturnRingTexture);  // Adding Saturn's ring

// Uranus with rings
const uranus = createPlanet(0.12, 35, "Uranus", uranusTexture);
scene.add(uranus);

// Neptune (last major planet)
const neptune = createPlanet(0.12, 40, "Neptune", neptuneTexture);
scene.add(neptune);

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
  const objs = [sunSphere, mercury, venus, earth, mars, asteroidBelt, jupiter, saturn, uranus, neptune];
  const intersects = raycaster.intersectObjects(objs, true);

  if (intersects.length > 0) {
	// Show the info window
	const infoWindow = document.getElementById('infoWindow');
	
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
// function render(time: number) {
// 	time *= 0.001;  // convert time to seconds
   
// 	// sun.rotation.x = time;
// 	// sun.rotation.y = time;
   
// 	renderer.render(scene, camera);
   
// 	requestAnimationFrame(render);
// }

// requestAnimationFrame(render);

// const sun: CelestialObject = new CelestialObject()

// manager.onLoad = () => init(sceneData);



// const venus: CelestialObject = new CelestialObject(new Trajectory("Venus",0.72333199,3.39471,54.9,0.00677323,76.7,181.98,0.615));
// function init(data) {
// 	const { objs } = data;
// 	const solarSystem = new THREE.Group();
// 	solarSystem.userData.update = (t) => {
// 		solarSystem.children.forEach((child) => {
// 			child.userData.update?.(t);
// 		});
// 	}
// }
// objs.forEach((name) => {
	// 	let path = `/textures/gltf/${name}/scene.gltf`;
// 	loader.load(path, (obj) => {
	// 		obj.traverse((child) => {
		// 			if (child.isMesh) {
			// 				sceneData.objs.push(child);
			// 			}
			// 		});
// 	});
// });


// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;



//   const sun = getSun();
//   solarSystem.add(sun);

//   const mercury = getPlanet({ size: 0.1, distance: 1.25, img: 'mercury.png' });
//   solarSystem.add(mercury);

//   const venus = getPlanet({ size: 0.2, distance: 1.65, img: 'venus.png' });
//   solarSystem.add(venus);

//   const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' });
//   const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth.png' });
//   solarSystem.add(earth);

//   const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars.png' });
//   solarSystem.add(mars);

//   const asteroidBelt = getAsteroidBelt(objs);
//   solarSystem.add(asteroidBelt);

//   const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter.png' });
//   solarSystem.add(jupiter);

//   const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
//   const sRingMat = new THREE.MeshStandardMaterial();
//   const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
//   saturnRing.scale.z = 0.1;
//   saturnRing.rotation.x = Math.PI * 0.5;
//   const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25, img: 'saturn.png' });
//   solarSystem.add(saturn);

//   const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
//   const uRingMat = new THREE.MeshStandardMaterial();
//   const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
//   uranusRing.scale.z = 0.1;
//   const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75, img: 'uranus.png' });
//   solarSystem.add(uranus);

//   const neptune = getPlanet({ size: 0.3, distance: 4.25, img: 'neptune.png' });
//   solarSystem.add(neptune);

//   const elipticLines = getElipticLines();
//   solarSystem.add(elipticLines);

//   const starfield = getStarfield({ numStars: 500, size: 0.35 });
//   scene.add(starfield);

//   const nebula = getNebula({
//     hue: 0.6,
//     numSprites: 10,
//     opacity: 0.2,
//     radius: 40,
//     size: 80,
//     z: -50.5,
//   });
//   scene.add(nebula);

//   const anotherNebula = getNebula({
//     hue: 0.0,
//     numSprites: 10,
//     opacity: 0.2,
//     radius: 40,
//     size: 80,
//     z: 50.5,
//   });
//   scene.add(anotherNebula);

	// animate()
// }