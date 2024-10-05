# Solar System Simulation

This project is a 3D simulation of the solar system using **Three.js**. It includes various planets, complete with textures and realistic orbital dynamics. The user can interact with the scene, click on planets to zoom in, and view detailed information about each planet.

## Features

- Realistic planet orbits and rotations.
- Interactive camera controls to zoom in on planets.
- Educational information about each planet, including mass, temperature, day length, and more.
- Simulation speed control using a slider.
  
## Installation

To run this project, you need to have **Node.js** installed on your machine.

### Steps:

1. Clone the repository or download the files.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the necessary dependencies:

    ```bash
    npm install
    ```

4. After the dependencies are installed, start the development server by running:

    ```bash
    npm start
    ```

5. Open a browser and go to `http://localhost:3000` to view the simulation.

## Project Structure

- `App.js`: The main entry point for the React application. It sets up the canvas for rendering the 3D scene.
- `Orrey.js`: Handles the initialization of the solar system, including setting up the scene, camera, and planets.
- `getPlanet.js`: A utility function that generates individual planets with properties like size, distance, and texture.

## Controls

- **Camera**: Use mouse controls to rotate, pan, and zoom in/out of the scene.
- **Planet Selection**: Click on a planet to zoom in and see detailed information. Clicking again will reset the camera to its original position.
- **Simulation Speed**: Use the slider at the bottom of the screen to control the simulation speed, from real-time to an accelerated view of the orbits.

## Dependencies

- **React**: JavaScript library for building user interfaces.
- **Three.js**: 3D library used for rendering the solar system.
- **TWEEN.js**: A library for handling smooth animations.
- **OrbitControls**: Provides mouse control for orbiting around the scene.

## License

This project is open-source and available under the [MIT License](LICENSE).

