import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import { CelestialObject, Trajectory } from "./CelestialObject.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);

// const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader();
const pngLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);


document.body.appendChild(renderer.domElement);

pngLoader.load("/textures/starmap-warped.png", function (texture : THREE.Texture) {
	console.log(texture);
	texture.mapping = THREE.EquirectangularReflectionMapping;

	// Set the loaded EXR as the scene background
	scene.background = texture;

}, undefined, function (error) {
	console.error('Error loading PNG:', error); // Log any errors
});

// let sun: THREE.Group;
gltfLoader.load("/textures/glb/sun.glb", (gltf) => {
	const sun = new THREE.Object3D();
	const dirLight = new THREE.HemisphereLight(0xFFFFFF,0xFFFFFF, 10);
	sun.add(dirLight);
	sun.add(gltf.scene);
	sun.position.set(0, 0, 0);

	scene.add(sun);
}, undefined, function (error) {
	console.error('An error happened while loading the GLTF model:', error);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
camera.position.z = 1;

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

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