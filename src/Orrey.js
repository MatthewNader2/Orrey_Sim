import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import getSun from "./getSun";
import getPlanet from "./getPlanet";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import TWEEN from "@tweenjs/tween.js"; // Import TWEEN for animations

const SCALE_DISTANCE = 15;
const SCALE_SIZE = 0.5;
const ORBIT_RADIUS_OFFSET = 5;
const PLANET_SCALE_FACTOR = 2;
let simulationSpeed = 1;

const moonOrbitRadius = 0.00257 * SCALE_DISTANCE;
const moonOrbitalPeriod = 27.32 * 86400;
const moonRotationPeriod = 27.32 * 86400;

// Planet info data
const planetInfo = {
  Mercury: {
    mass: "3.285 × 10^23 kg",
    age: "4.5 billion years",
    tempMin: "-173°C",
    tempMax: "427°C",
    dayLength: "1,408 hours",
    yearLength: "88 Earth-days",
    brief:
      "Mercury is the smallest and innermost planet in the Solar System. It has extreme temperature variations and no atmosphere to retain heat.",
  },
  Venus: {
    mass: "4.867 × 10^24 kg",
    age: "4.5 billion years",
    tempMin: "462°C",
    tempMax: "462°C",
    dayLength: "5,832 hours",
    yearLength: "225 Earth-days",
    brief:
      "Venus has a thick, toxic atmosphere and is the hottest planet in the Solar System due to its runaway greenhouse effect.",
  },
  Earth: {
    mass: "5.972 × 10^24 kg",
    age: "4.543 billion years",
    tempMin: "-88°C",
    tempMax: "58°C",
    dayLength: "24 hours",
    yearLength: "365.25 Earth-days",
    brief:
      "Earth is the only planet known to support life. It has a moderate climate, liquid water, and a protective atmosphere.",
  },
  Mars: {
    mass: "6.39 × 10^23 kg",
    age: "4.6 billion years",
    tempMin: "-125°C",
    tempMax: "20°C",
    dayLength: "24.6 hours",
    yearLength: "687 Earth-days",
    brief:
      "Mars is known as the 'Red Planet' due to iron oxide on its surface. It has the largest volcano and canyon in the Solar System.",
  },
  Jupiter: {
    mass: "1.898 × 10^27 kg",
    age: "4.503 billion years",
    tempMin: "-145°C",
    tempMax: "-108°C",
    dayLength: "9.9 hours",
    yearLength: "4,333 Earth-days",
    brief:
      "Jupiter is the largest planet in the Solar System. It has a strong magnetic field, over 79 moons, and the iconic Great Red Spot.",
  },
  Saturn: {
    mass: "5.683 × 10^26 kg",
    age: "4.503 billion years",
    tempMin: "-178°C",
    tempMax: "-138°C",
    dayLength: "10.7 hours",
    yearLength: "10,759 Earth-days",
    brief:
      "Saturn is famous for its stunning ring system made of ice and rock particles. It is a gas giant with many moons.",
  },
  Uranus: {
    mass: "8.681 × 10^25 kg",
    age: "4.503 billion years",
    tempMin: "-224°C",
    tempMax: "-197°C",
    dayLength: "17 hours",
    yearLength: "30,687 Earth-days",
    brief:
      "Uranus is unique in that it rotates on its side. It has faint rings and is known for its cold atmosphere.",
  },
  Neptune: {
    mass: "1.024 × 10^26 kg",
    age: "4.503 billion years",
    tempMin: "-218°C",
    tempMax: "-201°C",
    dayLength: "16 hours",
    yearLength: "60,190 Earth-days",
    brief:
      "Neptune is the farthest planet from the Sun. It has strong winds and violent storms in its deep blue atmosphere.",
  },
};

// Create and display the planet info panel
function showPlanetInfo(planetName) {
  const info = planetInfo[planetName];

  if (info) {
    document.getElementById("planet-name").innerText = planetName;
    document.getElementById("planet-mass").innerText = info.mass;
    document.getElementById("planet-age").innerText = info.age;
    document.getElementById("planet-temp-min").innerText = info.tempMin;
    document.getElementById("planet-temp-max").innerText = info.tempMax;
    document.getElementById("planet-day-length").innerText = info.dayLength;
    document.getElementById("planet-year-length").innerText = info.yearLength;
    document.getElementById("planet-brief").innerText = info.brief;

    document.getElementById("info-panel").style.display = "block";
  }
}

function hidePlanetInfo() {
  document.getElementById("info-panel").style.display = "none";
}

export default function initOrrey() {
  const canvasContainer = document.getElementById("three-canvas");
  if (!canvasContainer) {
    console.error("Canvas container not found!");
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 50000);
  camera.position.set(0, 100, 150);

  // Store original camera position
  let originalCameraPosition = new THREE.Vector3();
  originalCameraPosition.copy(camera.position);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasContainer,
  });
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.zoomSpeed = 0.5;
  controls.enablePan = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  const sun = getSun();
  sun.scale.set(75, 75, 75);
  sun.material.emissiveIntensity = 5;
  scene.add(sun);

  const sunLight = new THREE.PointLight(0xffdd44, 40, 8000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const moon = getPlanet({
    name: "Moon",
    size: 0.27 * PLANET_SCALE_FACTOR,
    distance: 0.00257 * SCALE_DISTANCE,
    orbitalPeriod: 27.32,
    rotationPeriod: 27.32,
    tilt: 1.54 * (Math.PI / 180),
    inclination: 5.14 * (Math.PI / 180),
    texture: "/textures/moon.png",
    color: 0xffffff,
  });

  // Planet Data with rotation and orbit period (in days and years), including orbital inclination
  const PLANETS = [
    {
      name: "Mercury",
      size: 0.383 * PLANET_SCALE_FACTOR,
      distance: 0.39 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 88, // Days
      rotationPeriod: 58.6, // Days (rotation around itself)
      tilt: 0.034,
      inclination: 7 * (Math.PI / 180), // Mercury's orbit inclination
      color: 0xbfbfbf,
      texture: "/textures/mercury.png",
    },
    {
      name: "Venus",
      size: 0.949 * PLANET_SCALE_FACTOR,
      distance: 0.72 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 224.7, // Days
      rotationPeriod: -243, // Days (retrograde rotation)
      tilt: 177.4 * (Math.PI / 180),
      inclination: 3.39 * (Math.PI / 180), // Venus' orbit inclination
      color: 0xffcc33,
      texture: "/textures/venus.png",
    },
    {
      name: "Earth",
      size: 1.0 * PLANET_SCALE_FACTOR,
      distance: 1.0 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 365.25,
      rotationPeriod: 1,
      tilt: 23.5 * (Math.PI / 180),
      inclination: 0.00005 * (Math.PI / 180),
      color: 0x2f74ff,
      texture: "/textures/earth.png",
      children: [moon],
    },
    {
      name: "Mars",
      size: 0.532 * PLANET_SCALE_FACTOR,
      distance: 1.52 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 687, // Days
      rotationPeriod: 1.03, // Days
      tilt: 25.2 * (Math.PI / 180),
      inclination: 1.85 * (Math.PI / 180), // Mars' orbit inclination
      color: 0xff6633,
      texture: "/textures/mars.png",
    },
    {
      name: "Jupiter",
      size: 11.21 * PLANET_SCALE_FACTOR,
      distance: 5.2 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 4333, // Days
      rotationPeriod: 0.41, // Days
      tilt: 3.1 * (Math.PI / 180),
      inclination: 1.3 * (Math.PI / 180), // Jupiter's orbit inclination
      color: 0xffcc99,
      texture: "/textures/jupiter.png",
    },
    {
      name: "Saturn",
      size: 9.45 * PLANET_SCALE_FACTOR,
      distance: 9.58 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 10759, // Days
      rotationPeriod: 0.44, // Days
      tilt: 26.7 * (Math.PI / 180),
      inclination: 2.48 * (Math.PI / 180), // Saturn's orbit inclination
      color: 0xffd700,
      texture: "/textures/saturn.png",
    },
    {
      name: "Uranus",
      size: 4.01 * PLANET_SCALE_FACTOR,
      distance: 19.2 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 30687, // Days
      rotationPeriod: -0.72, // Days (retrograde rotation)
      tilt: 97.8 * (Math.PI / 180),
      inclination: 0.77 * (Math.PI / 180), // Uranus' orbit inclination
      color: 0x66ccff,
      texture: "/textures/uranus.png",
    },
    {
      name: "Neptune",
      size: 3.88 * PLANET_SCALE_FACTOR,
      distance: 30.05 + ORBIT_RADIUS_OFFSET,
      orbitalPeriod: 60190, // Days
      rotationPeriod: 0.67, // Days
      tilt: 28.3 * (Math.PI / 180),
      inclination: 1.77 * (Math.PI / 180), // Neptune's orbit inclination
      color: 0x3366ff,
      texture: "/textures/neptune.png",
    },
  ];

  function createPlanet({
    name,
    size,
    distance,
    orbitalPeriod,
    rotationPeriod,
    tilt,
    inclination,
    texture,
    color,
    children = [],
  }) {
    const texLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(size * SCALE_SIZE, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: texLoader.load(
        texture,
        () => console.log(`${texture} loaded`),
        undefined,
        () => {
          material.color = new THREE.Color(color);
        }
      ),
      emissive: new THREE.Color(0x222222),
      emissiveIntensity: 0.5,
      roughness: 0.5,
      metalness: 0.1,
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.rotation.z = tilt;
    planet.name = name; // Assign planet name here!

    const orbitRadius = distance * SCALE_DISTANCE;
    const orbitMaterial = new THREE.LineBasicMaterial({ color });
    const orbitPoints = [];

    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      orbitPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * orbitRadius,
          Math.sin(angle) * orbitRadius * Math.sin(inclination),
          Math.sin(angle) * orbitRadius
        )
      );
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbit);

    planet.position.x = orbitRadius;
    planet.position.y = 0;
    scene.add(planet);

    planet.userData = {
      orbitalPeriod: orbitalPeriod * 86400,
      rotationPeriod: rotationPeriod * 86400,
      orbitRadius,
      inclination,
    };

    children.forEach((child) => {
      child.position.x += planet.position.x;
      child.position.y += planet.position.y;
      child.position.z += planet.position.z;
      planet.add(child);
    });

    return planet;
  }

  const planets = PLANETS.map(createPlanet);

  function updateMoonPosition(earth, moon, simulationTime) {
    const moonAngle = (simulationTime / moonOrbitalPeriod) * Math.PI * 2;
    moon.position.x = earth.position.x + Math.cos(moonAngle) * moonOrbitRadius;
    moon.position.z = earth.position.z + Math.sin(moonAngle) * moonOrbitRadius;
    moon.position.y = earth.position.y;
    moon.rotation.y += simulationTime / moonRotationPeriod;
  }

  // Add raycaster and mouse to detect planet clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();  
  let selectedPlanet = null;

  // Handle clicks in the scene
  window.addEventListener("click", (event) => {
    // Ignore clicks on the slider or other UI elements
    if (event.target.tagName !== "CANVAS") return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;

      console.log("Clicked object:", clickedObject.name); // Debug to see what's clicked

      // Only select if it's a planet and not the sun
      if (clickedObject.name !== "Sun" && clickedObject.name) {
        if (clickedObject !== selectedPlanet) {
          moveCameraToPlanet(clickedObject);
          selectedPlanet = clickedObject;
        } else {
          resetCameraPosition();
          selectedPlanet = null;
        }
      }
    } else {
      // Clicked elsewhere in space, reset camera
      resetCameraPosition();
      selectedPlanet = null;
    }
  });

function moveCameraToPlanet(planet) {
  const planetName = planet.name;
  
  showPlanetInfo(planetName); // Show planet info when a planet is selected

  const targetPosition = new THREE.Vector3();
  targetPosition.copy(planet.position);

  const planetSize = planet.geometry.parameters.radius;
  const zoomFactor = 3 * planetSize;

  const orbitalSpeed = planet.userData.orbitalPeriod;
  const animationDuration = Math.max(2000 / (orbitalSpeed / simulationSpeed), 500);

  new TWEEN.Tween(camera.position)
    .to({
      x: targetPosition.x,
      y: targetPosition.y + zoomFactor / 2,
      z: targetPosition.z + zoomFactor
    }, animationDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  new TWEEN.Tween(controls.target)
    .to({ x: planet.position.x, y: planet.position.y, z: planet.position.z }, animationDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

function resetCameraPosition() {
  hidePlanetInfo(); // Hide the info panel when resetting the camera position

  new TWEEN.Tween(camera.position)
    .to({ x: originalCameraPosition.x, y: originalCameraPosition.y, z: originalCameraPosition.z }, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  new TWEEN.Tween(controls.target)
    .to({ x: 0, y: 0, z: 0 }, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

  // Create the slider UI
  const sliderContainer = document.createElement("div");
  sliderContainer.style.position = "absolute";
  sliderContainer.style.bottom = "20px";
  sliderContainer.style.left = "50%";
  sliderContainer.style.transform = "translateX(-50%)";
  sliderContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  sliderContainer.style.padding = "10px";
  sliderContainer.style.borderRadius = "10px";
  sliderContainer.style.color = "white";
  sliderContainer.style.fontFamily = "Arial, sans-serif";
  sliderContainer.style.textAlign = "center";

  // Display for showing the simulation speed
  const speedDisplay = document.createElement("div");
  speedDisplay.textContent = "1 sec = 1 sec";
  speedDisplay.style.marginBottom = "10px";
  speedDisplay.style.fontSize = "18px";

  // Create the large and sensitive slider
  const speedSlider = document.createElement("input");
  speedSlider.type = "range";
  speedSlider.min = "1"; // Minimum value (1 second per second)
  speedSlider.max = (10 * 365 * 24 * 60 * 60).toString(); // Maximum value (10 years per second)
  speedSlider.value = "1"; // Start with real-time (1 second = 1 second)

  // Make the slider cover almost the entire width of the screen with margins
  speedSlider.style.width = "90vw"; // 90% of the viewport width
  speedSlider.style.height = "30px"; // Increase slider height for better sensitivity
  speedSlider.style.margin = "0 5vw"; // Center the slider with 5vw margin on both sides
  speedSlider.style.accentColor = "#00f"; // Blue accent color for the slider
  speedSlider.style.cursor = "pointer"; // Pointer cursor for better UI feel

  // Event listener to update speed and display
  speedSlider.addEventListener("input", function () {
    simulationSpeed = parseInt(this.value, 10);
    let displayText = "";

    if (simulationSpeed < 60) {
      displayText = `1 sec = ${simulationSpeed} sec`;
    } else if (simulationSpeed < 3600) {
      displayText = `1 sec = ${Math.floor(simulationSpeed / 60)} min`;
    } else if (simulationSpeed < 86400) {
      displayText = `1 sec = ${Math.floor(simulationSpeed / 3600)} hour`;
    } else if (simulationSpeed < 86400 * 30) {
      displayText = `1 sec = ${Math.floor(simulationSpeed / 86400)} days`;
    } else if (simulationSpeed < 86400 * 365) {
      displayText = `1 sec = ${Math.floor(
        simulationSpeed / (86400 * 30)
      )} months`;
    } else {
      displayText = `1 sec = ${Math.floor(
        simulationSpeed / (86400 * 365)
      )} years`;
    }

    speedDisplay.textContent = displayText;
  });

  // Append the slider and display to the container
  sliderContainer.appendChild(speedDisplay);
  sliderContainer.appendChild(speedSlider);
  document.body.appendChild(sliderContainer);

  sliderContainer.appendChild(speedDisplay);
  sliderContainer.appendChild(speedSlider);
  document.body.appendChild(sliderContainer);

  // Animation loop
  function animate(realTime = 0) {
    requestAnimationFrame(animate);

    const realSeconds = realTime / 1000;
    const simulationTime = realSeconds * simulationSpeed;

    planets.forEach((planet) => {
      const { orbitalPeriod, rotationPeriod, orbitRadius, inclination } =
        planet.userData;

      const orbitalAngle = (simulationTime / orbitalPeriod) * Math.PI * 2;
      planet.position.x = Math.cos(orbitalAngle) * orbitRadius;
      planet.position.y =
        Math.sin(orbitalAngle) * orbitRadius * Math.sin(inclination);
      planet.position.z = Math.sin(orbitalAngle) * orbitRadius;

      planet.rotation.y += (realSeconds / rotationPeriod) * simulationSpeed;

      if (planet.name === "Earth") {
        const moon = planet.children.find((child) => child.name === "Moon");
        if (moon) {
          updateMoonPosition(planet, moon, simulationTime);
        }
      }
    });

    // If a planet is selected, smoothly follow it
    if (selectedPlanet) {
      const planetSize = selectedPlanet.geometry.parameters.radius;
      const zoomFactor = 3 * planetSize;

      // Tween to follow the selected planet smoothly
      new TWEEN.Tween(camera.position)
        .to(
          {
            x: selectedPlanet.position.x,
            y: selectedPlanet.position.y + zoomFactor / 2,
            z: selectedPlanet.position.z + zoomFactor,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(controls.target)
        .to(
          {
            x: selectedPlanet.position.x,
            y: selectedPlanet.position.y,
            z: selectedPlanet.position.z,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update(); // Update tweens
  }

  animate();

  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}
