# Orrery, Or Are We?
https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/css-craft-night-2-electric-googleloo/?tab=project

## High Level Summary
We developed an interactive 3D web-based orrery (solar system model) that allows users to explore and learn about celestial bodies in our solar system. This project directly addresses the challenge by creating an engaging, educational tool that visualizes the positions and movements of planets relative to the Sun. It's important because it makes complex astronomical concepts accessible and interactive, inspiring interest in space science and serving as a valuable educational resource. Answer: We are. PS: There is a hidden easter egg somewhere within the scene.

## Project Demo
https://youtu.be/dSeUayV1NOw

## Project Details
### How it works:

1. The application uses Three.js to render a 3D scene in the web browser
2. Each planet is represented as a CelestialObject with its own Trajectory
3. Planetary positions are calculated using Keplerian orbital elements
4. User interactions are handled through OrbitControls
5. The scene updates in real-time to show planetary motion

### Benefits:

1. Provides an intuitive, visual way to understand planetary orbits and relative positions
2. Offers an interactive learning experience that can engage users more effectively than static images or videos
3. Serves as a foundation for more complex astronomical visualizations and simulations

### Goals:

1. To create an engaging educational tool for learning about our solar system
2. To demonstrate the potential of web-based 3D graphics for scientific visualization
3. To provide a platform that can be extended with more detailed astronomical data and features

### Tools and Technologies Used:

1. Three.js: A popular JavaScript 3D library used for creating and displaying animated 3D computer graphics in a web browser
2. TypeScript: A typed superset of JavaScript that compiles to plain JavaScript, used for improved code reliability and maintainability
3. HTML/CSS: For structuring and styling the web page
4. Web technologies: The project runs entirely in a web browser, making it accessible across different devices and platforms

## Credits
- Skybox Image: NASA's Scientific Visualization Studio (https://svs.gsfc.nasa.gov/4856/)
- Planet and sun textures (https://www.solarsystemscope.com/textures/)
