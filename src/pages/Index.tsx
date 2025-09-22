import React, { useEffect, useRef } from 'react';

const DisasterTrainingGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject the complete game HTML
    containerRef.current.innerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Disaster Preparedness Training</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            overflow: hidden;
            color: white;
            user-select: none;
        }

        #gameContainer {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        #gameCanvas {
            display: block;
            cursor: crosshair;
        }

        /* UI Overlay */
        #ui {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        }

        #ui > * {
            pointer-events: auto;
        }

        /* HUD */
        #hud {
            position: absolute;
            top: 15px;
            left: 15px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9));
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(100, 200, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        #timer {
            font-size: 28px;
            font-weight: bold;
            color: #ff6b6b;
            text-shadow: 2px 2px 8px rgba(255, 107, 107, 0.5);
            margin-bottom: 10px;
        }

        #score, #itemsCollected, #health, #location {
            font-size: 18px;
            margin: 8px 0;
            color: #4ecdc4;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .health-bar {
            width: 100px;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }

        .health-fill {
            height: 100%;
            background: linear-gradient(90deg, #44ff44, #88ff88);
            width: 100%;
            transition: width 0.3s ease;
        }

        /* Items Display */
        #itemsDisplay {
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9));
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(100, 200, 255, 0.3);
            min-width: 280px;
        }

        .item-category h4 {
            color: #ffaa44;
            margin-bottom: 8px;
            font-size: 16px;
            border-bottom: 1px solid rgba(255, 170, 68, 0.3);
            padding-bottom: 4px;
        }

        .item-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 5px 0;
            padding: 8px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
        }

        .item-icon {
            width: 35px;
            height: 35px;
            border: 2px solid #555;
            border-radius: 8px;
            background: #333;
            text-align: center;
            line-height: 31px;
            font-size: 16px;
            flex-shrink: 0;
        }

        .item-icon.collected {
            border-color: #4ecdc4;
            background: linear-gradient(145deg, #4ecdc4, #44b3a8);
            color: white;
            box-shadow: 0 2px 10px rgba(78, 205, 196, 0.4);
        }

        /* Menu Screens */
        .screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 200;
            backdrop-filter: blur(20px);
        }

        .screen h1 {
            font-size: 56px;
            margin-bottom: 20px;
            text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.8);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffaa44);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .screen p {
            font-size: 18px;
            margin: 10px 0;
            max-width: 700px;
            text-align: center;
            line-height: 1.6;
        }

        .button {
            background: linear-gradient(45deg, #ff6b6b, #ff8e53);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
            font-weight: bold;
        }

        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .scenario-button {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            min-width: 300px;
            padding: 20px 30px;
            font-size: 20px;
            margin: 15px;
            box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3);
        }

        .scenario-button:hover {
            background: linear-gradient(45deg, #44b3a8, #3d8f7d);
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
        }

        .scenario-info {
            font-size: 14px;
            color: #aaa;
            margin-top: 8px;
        }

        /* Instructions */
        #instructions {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9));
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(100, 200, 255, 0.3);
            font-size: 12px;
            max-width: 250px;
            line-height: 1.4;
        }

        .control-group {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }

        .key-hint {
            background: rgba(255, 255, 255, 0.1);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: monospace;
            color: #ffaa44;
        }

        /* Status Messages */
        .status-message {
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 250;
            animation: fadeInOut 3s ease-in-out forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }

        /* Crosshair */
        #crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 150;
        }

        #crosshair::before,
        #crosshair::after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }

        #crosshair::before {
            top: 50%;
            left: 8px;
            transform: translateY(-50%);
            width: 4px;
            height: 2px;
        }

        #crosshair::after {
            left: 50%;
            top: 8px;
            transform: translateX(-50%);
            width: 2px;
            height: 4px;
        }

        .hidden {
            display: none !important;
        }

        /* Enhanced character display */
        #characterInfo {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9));
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(100, 200, 255, 0.3);
            font-size: 14px;
            color: #4ecdc4;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <!-- UI Overlay -->
        <div id="ui">
            <!-- Start Screen -->
            <div id="startScreen" class="screen">
                <h1>Enhanced Disaster Training</h1>
                <p>Experience realistic emergency scenarios in a detailed 3D environment with buildings and interiors.</p>
                <p>Learn life-saving skills through immersive disaster preparedness training.</p>
                <button class="button" onclick="showScenarioSelect()">Start Training</button>
            </div>

            <!-- Scenario Selection Screen -->
            <div id="scenarioScreen" class="screen hidden">
                <h1>Select Emergency Scenario</h1>
                <p>Choose a disaster scenario to practice emergency response</p>
                
                <button class="scenario-button" onclick="startGame('earthquake')">
                    🏫 Earthquake at School
                    <div class="scenario-info">Navigate realistic buildings and classrooms during seismic activity</div>
                </button>
                
                <button class="scenario-button" onclick="startGame('fire')">
                    🔥 Fire Emergency
                    <div class="scenario-info">Escape through smoke-filled corridors and rooms</div>
                </button>
                
                <button class="scenario-button" onclick="startGame('flood')">
                    🌊 Flood Evacuation
                    <div class="scenario-info">Navigate flooded buildings and find higher ground</div>
                </button>
                
                <button class="scenario-button" onclick="startGame('tornado')">
                    🌪️ Tornado Warning
                    <div class="scenario-info">Seek shelter in interior rooms and basements</div>
                </button>
                
                <button class="button" onclick="showStartScreen()">Back</button>
            </div>

            <!-- Game Over Screen -->
            <div id="gameOverScreen" class="screen hidden">
                <h1 id="gameOverTitle">Training Complete</h1>
                <p id="gameOverMessage"></p>
                <p id="finalScore"></p>
                <button class="button" onclick="showScenarioSelect()">Try Another Scenario</button>
                <button class="button" onclick="showStartScreen()">Main Menu</button>
            </div>

            <!-- HUD -->
            <div id="hud" class="hidden">
                <div id="timer">Time: 180s</div>
                <div id="score">Score: 0</div>
                <div id="itemsCollected">Items: 0/8</div>
                <div id="location">Location: Main Building</div>
                <div id="health">
                    Health: <div class="health-bar"><div class="health-fill"></div></div>
                </div>
            </div>

            <!-- Items Display -->
            <div id="itemsDisplay" class="hidden">
                <div class="item-category">
                    <h4>🎒 Emergency Supplies</h4>
                    <div class="item-row">
                        <div class="item-icon" id="item-flashlight">🔦</div>
                        <div class="item-info">Emergency Flashlight</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-firstaid">🏥</div>
                        <div class="item-info">First Aid Kit</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-water">💧</div>
                        <div class="item-info">Water Bottle</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-food">🍎</div>
                        <div class="item-info">Emergency Food</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-radio">📻</div>
                        <div class="item-info">Emergency Radio</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-blanket">🧥</div>
                        <div class="item-info">Emergency Blanket</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-whistle">🎺</div>
                        <div class="item-info">Emergency Whistle</div>
                    </div>
                    <div class="item-row">
                        <div class="item-icon" id="item-documents">📄</div>
                        <div class="item-info">Important Documents</div>
                    </div>
                </div>
            </div>

            <!-- Character Info -->
            <div id="characterInfo" class="hidden">
                <h4>👤 Character Status</h4>
                <div>Position: <span id="playerPos">Building Entrance</span></div>
                <div>Movement: <span id="playerMovement">Standing</span></div>
                <div>Looking: <span id="playerDirection">North</span></div>
            </div>

            <!-- Instructions -->
            <div id="instructions" class="hidden">
                <h3>Controls:</h3>
                <div class="control-group">
                    <span>Move:</span>
                    <span class="key-hint">WASD</span>
                </div>
                <div class="control-group">
                    <span>Look:</span>
                    <span class="key-hint">Mouse</span>
                </div>
                <div class="control-group">
                    <span>Run:</span>
                    <span class="key-hint">Shift</span>
                </div>
                <div class="control-group">
                    <span>Jump:</span>
                    <span class="key-hint">Space</span>
                </div>
                <div class="control-group">
                    <span>Collect:</span>
                    <span class="key-hint">Click</span>
                </div>
                <div class="control-group">
                    <span>Enter Room:</span>
                    <span class="key-hint">F</span>
                </div>
            </div>

            <!-- Crosshair -->
            <div id="crosshair" class="hidden"></div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        class EnhancedDisasterTraining {
            constructor() {
                this.scenarios = {
                    earthquake: {
                        ground: 0x8b7355,
                        sky: 0x87ceeb,
                        buildings: 0xa0a0a0,
                        name: 'Earthquake',
                        time: 180,
                        description: 'Navigate shaking buildings and find safety'
                    },
                    fire: {
                        ground: 0x654321,
                        sky: 0x696969,
                        buildings: 0x8b4513,
                        name: 'Fire Emergency',
                        time: 150,
                        description: 'Escape through smoke-filled environments'
                    },
                    flood: {
                        ground: 0x4682b4,
                        sky: 0x708090,
                        buildings: 0x2f4f4f,
                        name: 'Flood',
                        time: 200,
                        description: 'Navigate flooded areas to higher ground'
                    },
                    tornado: {
                        ground: 0x556b2f,
                        sky: 0x2f4f4f,
                        buildings: 0x696969,
                        name: 'Tornado',
                        time: 120,
                        description: 'Seek interior shelter immediately'
                    }
                };

                this.itemTypes = ['flashlight', 'firstaid', 'water', 'food', 'radio', 'blanket', 'whistle', 'documents'];
                this.items = [];
                this.collectedItems = new Set();
                this.buildings = [];
                this.rooms = [];
                this.doors = [];
                
                this.score = 0;
                this.health = 100;
                this.gameTime = 180;
                this.currentScenario = null;
                this.gameActive = false;
                this.keys = {};
                this.mouseMovement = { x: 0, y: 0 };
                this.playerVelocityY = 0;
                this.isRunning = false;
                this.pointerLocked = false;
                this.currentRoom = null;

                this.initThreeJS();
                this.setupControls();
                this.setupUI();
                this.startGameLoop();
            }

            initThreeJS() {
                // Scene setup
                this.scene = new THREE.Scene();
                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                document.getElementById('gameContainer').appendChild(this.renderer.domElement);

                // Camera setup
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                this.camera.position.set(0, 3, 8);

                // Lighting setup
                this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
                this.scene.add(this.ambientLight);

                this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                this.directionalLight.position.set(50, 50, 25);
                this.directionalLight.castShadow = true;
                this.directionalLight.shadow.mapSize.width = 2048;
                this.directionalLight.shadow.mapSize.height = 2048;
                this.directionalLight.shadow.camera.near = 0.5;
                this.directionalLight.shadow.camera.far = 500;
                this.directionalLight.shadow.camera.left = -50;
                this.directionalLight.shadow.camera.right = 50;
                this.directionalLight.shadow.camera.top = 50;
                this.directionalLight.shadow.camera.bottom = -50;
                this.scene.add(this.directionalLight);

                // Window resize handler
                window.addEventListener('resize', () => {
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                });
            }

            createRealisticBuildings() {
                // Clear existing buildings
                this.buildings.forEach(building => this.scene.remove(building));
                this.buildings = [];
                this.rooms = [];
                this.doors = [];

                // Main School Building
                this.createMainBuilding();
                
                // Gymnasium
                this.createGymnasium();
                
                // Cafeteria Building
                this.createCafeteria();
                
                // Library
                this.createLibrary();
                
                // Administrative Building
                this.createAdminBuilding();
            }

            createMainBuilding() {
                const buildingGroup = new THREE.Group();
                
                // Main structure
                const buildingGeometry = new THREE.BoxGeometry(30, 12, 20);
                const buildingMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.buildings 
                });
                const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
                building.position.set(0, 6, 0);
                building.castShadow = true;
                building.receiveShadow = true;
                buildingGroup.add(building);

                // Roof
                const roofGeometry = new THREE.ConeGeometry(18, 4, 4);
                const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
                const roof = new THREE.Mesh(roofGeometry, roofMaterial);
                roof.position.set(0, 14, 0);
                roof.rotation.y = Math.PI / 4;
                roof.castShadow = true;
                buildingGroup.add(roof);

                // Windows
                for (let i = 0; i < 6; i++) {
                    const windowGeometry = new THREE.PlaneGeometry(2, 3);
                    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb });
                    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window1.position.set(-12 + i * 4, 8, 10.1);
                    buildingGroup.add(window1);

                    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window2.position.set(-12 + i * 4, 8, -10.1);
                    buildingGroup.add(window2);
                }

                // Main entrance
                const doorGeometry = new THREE.BoxGeometry(3, 5, 0.5);
                const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
                const door = new THREE.Mesh(doorGeometry, doorMaterial);
                door.position.set(0, 2.5, 10.25);
                buildingGroup.add(door);
                this.doors.push({ mesh: door, building: 'main', entrance: { x: 0, y: 1, z: 8 } });

                // Interior rooms (invisible from outside, for navigation)
                this.createClassrooms(buildingGroup);
                this.createHallways(buildingGroup);

                this.scene.add(buildingGroup);
                this.buildings.push(buildingGroup);
            }

            createClassrooms(building) {
                // Create multiple classrooms
                for (let i = 0; i < 4; i++) {
                    const classroom = {
                        bounds: {
                            minX: -12 + i * 6,
                            maxX: -6 + i * 6,
                            minZ: -8,
                            maxZ: 8,
                            minY: 0,
                            maxY: 4
                        },
                        name: \`Classroom \${i + 1}\`,
                        type: 'classroom'
                    };
                    this.rooms.push(classroom);

                    // Add desks and chairs (simplified)
                    for (let j = 0; j < 3; j++) {
                        for (let k = 0; k < 2; k++) {
                            const deskGeometry = new THREE.BoxGeometry(1.5, 0.8, 1);
                            const deskMaterial = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
                            const desk = new THREE.Mesh(deskGeometry, deskMaterial);
                            desk.position.set(
                                classroom.bounds.minX + 1 + j * 2,
                                0.4,
                                classroom.bounds.minZ + 2 + k * 3
                            );
                            desk.castShadow = true;
                            building.add(desk);
                        }
                    }
                }
            }

            createHallways(building) {
                const hallway = {
                    bounds: {
                        minX: -14,
                        maxX: 14,
                        minZ: 8,
                        maxZ: 10,
                        minY: 0,
                        maxY: 4
                    },
                    name: 'Main Hallway',
                    type: 'hallway'
                };
                this.rooms.push(hallway);
            }

            createGymnasium() {
                const gymGroup = new THREE.Group();
                
                const gymGeometry = new THREE.BoxGeometry(25, 10, 15);
                const gymMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.buildings 
                });
                const gym = new THREE.Mesh(gymGeometry, gymMaterial);
                gym.position.set(40, 5, 0);
                gym.castShadow = true;
                gym.receiveShadow = true;
                gymGroup.add(gym);

                // Basketball hoops
                const hoopGeometry = new THREE.RingGeometry(0.8, 1, 8);
                const hoopMaterial = new THREE.MeshLambertMaterial({ color: 0xff4500 });
                const hoop1 = new THREE.Mesh(hoopGeometry, hoopMaterial);
                hoop1.position.set(35, 8, 0);
                hoop1.rotation.x = Math.PI / 2;
                gymGroup.add(hoop1);

                const hoop2 = new THREE.Mesh(hoopGeometry, hoopMaterial);
                hoop2.position.set(45, 8, 0);
                hoop2.rotation.x = Math.PI / 2;
                gymGroup.add(hoop2);

                this.scene.add(gymGroup);
                this.buildings.push(gymGroup);
            }

            createCafeteria() {
                const cafeteriaGroup = new THREE.Group();
                
                const cafeteriaGeometry = new THREE.BoxGeometry(20, 8, 25);
                const cafeteriaMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.buildings 
                });
                const cafeteria = new THREE.Mesh(cafeteriaGeometry, cafeteriaMaterial);
                cafeteria.position.set(-35, 4, 0);
                cafeteria.castShadow = true;
                cafeteria.receiveShadow = true;
                cafeteriaGroup.add(cafeteria);

                // Tables and chairs
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 3; j++) {
                        const tableGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 8);
                        const tableMaterial = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
                        const table = new THREE.Mesh(tableGeometry, tableMaterial);
                        table.position.set(-40 + i * 3, 0.4, -8 + j * 6);
                        table.castShadow = true;
                        cafeteriaGroup.add(table);
                    }
                }

                this.scene.add(cafeteriaGroup);
                this.buildings.push(cafeteriaGroup);
            }

            createLibrary() {
                const libraryGroup = new THREE.Group();
                
                const libraryGeometry = new THREE.BoxGeometry(18, 9, 22);
                const libraryMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.buildings 
                });
                const library = new THREE.Mesh(libraryGeometry, libraryMaterial);
                library.position.set(0, 4.5, -35);
                library.castShadow = true;
                library.receiveShadow = true;
                libraryGroup.add(library);

                // Bookshelves
                for (let i = 0; i < 4; i++) {
                    const shelfGeometry = new THREE.BoxGeometry(0.5, 6, 15);
                    const shelfMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
                    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
                    shelf.position.set(-6 + i * 4, 3, -35);
                    shelf.castShadow = true;
                    libraryGroup.add(shelf);
                }

                this.scene.add(libraryGroup);
                this.buildings.push(libraryGroup);
            }

            createAdminBuilding() {
                const adminGroup = new THREE.Group();
                
                const adminGeometry = new THREE.BoxGeometry(15, 6, 12);
                const adminMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.buildings 
                });
                const admin = new THREE.Mesh(adminGeometry, adminMaterial);
                admin.position.set(35, 3, 30);
                admin.castShadow = true;
                admin.receiveShadow = true;
                adminGroup.add(admin);

                this.scene.add(adminGroup);
                this.buildings.push(adminGroup);
            }

            createVisibleCharacter() {
                // Remove existing player if any
                if (this.player) {
                    this.scene.remove(this.player);
                }

                // Create a more detailed character
                const playerGroup = new THREE.Group();

                // Body
                const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 2, 8);
                const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
                const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
                body.position.y = 1;
                body.castShadow = true;
                playerGroup.add(body);

                // Head
                const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
                const head = new THREE.Mesh(headGeometry, headMaterial);
                head.position.y = 2.5;
                head.castShadow = true;
                playerGroup.add(head);

                // Arms
                const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 6);
                const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
                
                const leftArm = new THREE.Mesh(armGeometry, armMaterial);
                leftArm.position.set(-0.8, 1.5, 0);
                leftArm.castShadow = true;
                playerGroup.add(leftArm);

                const rightArm = new THREE.Mesh(armGeometry, armMaterial);
                rightArm.position.set(0.8, 1.5, 0);
                rightArm.castShadow = true;
                playerGroup.add(rightArm);

                // Legs
                const legGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 6);
                const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2f4f4f });
                
                const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
                leftLeg.position.set(-0.3, -0.25, 0);
                leftLeg.castShadow = true;
                playerGroup.add(leftLeg);

                const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
                rightLeg.position.set(0.3, -0.25, 0);
                rightLeg.castShadow = true;
                playerGroup.add(rightLeg);

                // Backpack
                const backpackGeometry = new THREE.BoxGeometry(0.8, 1, 0.4);
                const backpackMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
                const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
                backpack.position.set(0, 1.5, -0.4);
                backpack.castShadow = true;
                playerGroup.add(backpack);

                this.player = playerGroup;
                this.player.position.set(0, 1.5, 8);
                this.scene.add(this.player);

                // Setup first-person camera relative to player
                this.setupFirstPersonCamera();
            }

            setupFirstPersonCamera() {
                // Position camera at head level
                this.cameraOffset = new THREE.Vector3(0, 1, 0);
                this.updateCameraPosition();
            }

            updateCameraPosition() {
                if (this.player) {
                    const playerPos = this.player.position.clone();
                    playerPos.add(this.cameraOffset);
                    this.camera.position.copy(playerPos);
                }
            }

            createEnvironment() {
                // Ground
                const groundGeometry = new THREE.PlaneGeometry(200, 200);
                const groundMaterial = new THREE.MeshLambertMaterial({ 
                    color: this.currentScenario.ground 
                });
                const ground = new THREE.Mesh(groundGeometry, groundMaterial);
                ground.rotation.x = -Math.PI / 2;
                ground.receiveShadow = true;
                this.scene.add(ground);

                // Sky
                this.scene.background = new THREE.Color(this.currentScenario.sky);

                // Trees and landscape
                this.createLandscape();
            }

            createLandscape() {
                // Trees around the campus
                for (let i = 0; i < 20; i++) {
                    const treeGroup = new THREE.Group();
                    
                    // Trunk
                    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
                    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
                    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                    trunk.position.y = 2;
                    trunk.castShadow = true;
                    treeGroup.add(trunk);
                    
                    // Leaves
                    const leavesGeometry = new THREE.SphereGeometry(3, 8, 6);
                    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
                    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                    leaves.position.y = 6;
                    leaves.castShadow = true;
                    treeGroup.add(leaves);
                    
                    // Random position around campus
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 60 + Math.random() * 40;
                    treeGroup.position.set(
                        Math.cos(angle) * radius,
                        0,
                        Math.sin(angle) * radius
                    );
                    
                    this.scene.add(treeGroup);
                }

                // Pathways
                for (let i = 0; i < 4; i++) {
                    const pathGeometry = new THREE.PlaneGeometry(4, 60);
                    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
                    const path = new THREE.Mesh(pathGeometry, pathMaterial);
                    path.rotation.x = -Math.PI / 2;
                    path.position.y = 0.01;
                    
                    if (i < 2) {
                        path.position.x = i === 0 ? -20 : 20;
                        path.position.z = 0;
                    } else {
                        path.position.x = 0;
                        path.position.z = i === 2 ? -20 : 20;
                        path.rotation.z = Math.PI / 2;
                    }
                    
                    this.scene.add(path);
                }
            }

            spawnItems() {
                // Clear existing items
                this.items.forEach(item => this.scene.remove(item.mesh));
                this.items = [];
                this.collectedItems.clear();

                // Spawn items in various locations throughout buildings
                const itemPositions = [
                    { x: -8, y: 1, z: 2, building: 'main', room: 'classroom' },
                    { x: 6, y: 1, z: -3, building: 'main', room: 'classroom' },
                    { x: -2, y: 1, z: 9, building: 'main', room: 'hallway' },
                    { x: 38, y: 1, z: 2, building: 'gym', room: 'gym' },
                    { x: -32, y: 1, z: -2, building: 'cafeteria', room: 'cafeteria' },
                    { x: 2, y: 1, z: -32, building: 'library', room: 'library' },
                    { x: 33, y: 1, z: 28, building: 'admin', room: 'office' },
                    { x: 15, y: 1, z: 15, building: 'outdoor', room: 'courtyard' }
                ];

                this.itemTypes.forEach((type, index) => {
                    const position = itemPositions[index];
                    const itemGroup = new THREE.Group();

                    // Item glow effect
                    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
                    const glowMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xffff00,
                        transparent: true,
                        opacity: 0.3
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    itemGroup.add(glow);

                    // Main item
                    const itemGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
                    const itemMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0xff6b35,
                        emissive: 0x442200,
                        emissiveIntensity: 0.2
                    });
                    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
                    itemMesh.castShadow = true;
                    itemGroup.add(itemMesh);

                    itemGroup.position.set(position.x, position.y, position.z);
                    
                    // Floating animation
                    itemGroup.userData = {
                        type: type,
                        originalY: position.y,
                        floatOffset: Math.random() * Math.PI * 2,
                        building: position.building,
                        room: position.room
                    };

                    this.scene.add(itemGroup);
                    this.items.push({ mesh: itemGroup, type: type, collected: false });
                });
            }

            createEvacuationZone() {
                // Evacuation zone at the main entrance
                const evacGeometry = new THREE.CylinderGeometry(4, 4, 0.5, 16);
                const evacMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x00ff00,
                    emissive: 0x004400,
                    emissiveIntensity: 0.3
                });
                this.evacuationZone = new THREE.Mesh(evacGeometry, evacMaterial);
                this.evacuationZone.position.set(0, 0.25, 15);
                this.evacuationZone.receiveShadow = true;
                this.scene.add(this.evacuationZone);

                // Add evacuation sign
                const signGeometry = new THREE.PlaneGeometry(3, 1.5);
                const signMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xff0000,
                    side: THREE.DoubleSide
                });
                const sign = new THREE.Mesh(signGeometry, signMaterial);
                sign.position.set(0, 3, 15);
                this.scene.add(sign);
            }

            setupControls() {
                // Keyboard controls
                window.addEventListener('keydown', (event) => {
                    this.keys[event.code] = true;
                    if (event.code === 'Space') {
                        event.preventDefault();
                        this.jump();
                    }
                    if (event.code === 'ShiftLeft') {
                        this.isRunning = true;
                    }
                    if (event.code === 'KeyF') {
                        this.tryEnterRoom();
                    }
                });

                window.addEventListener('keyup', (event) => {
                    this.keys[event.code] = false;
                    if (event.code === 'ShiftLeft') {
                        this.isRunning = false;
                    }
                });

                // Mouse controls
                window.addEventListener('mousedown', (event) => {
                    if (this.gameActive) {
                        this.tryCollectItem();
                        this.renderer.domElement.requestPointerLock();
                    }
                });

                window.addEventListener('pointerlockchange', () => {
                    this.pointerLocked = document.pointerLockElement === this.renderer.domElement;
                });

                window.addEventListener('mousemove', (event) => {
                    if (!this.pointerLocked || !this.gameActive) return;
                    
                    this.mouseMovement.x += event.movementX;
                    this.mouseMovement.y += event.movementY;
                    
                    this.camera.rotation.y -= event.movementX * 0.002;
                    this.camera.rotation.x -= event.movementY * 0.002;
                    this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
                });
            }

            setupUI() {
                // Initialize UI elements
                document.getElementById('startScreen').classList.remove('hidden');
            }

            startGame(scenarioName) {
                this.currentScenario = this.scenarios[scenarioName];
                this.gameTime = this.currentScenario.time;
                this.score = 0;
                this.health = 100;
                this.collectedItems.clear();
                this.gameActive = true;

                // Clear scene
                while (this.scene.children.length > 0) {
                    this.scene.remove(this.scene.children[0]);
                }

                // Re-add lights
                this.scene.add(this.ambientLight);
                this.scene.add(this.directionalLight);

                // Create environment
                this.createEnvironment();
                this.createRealisticBuildings();
                this.createVisibleCharacter();
                this.spawnItems();
                this.createEvacuationZone();

                // Hide menu screens, show game UI
                document.getElementById('startScreen').classList.add('hidden');
                document.getElementById('scenarioScreen').classList.add('hidden');
                document.getElementById('gameOverScreen').classList.add('hidden');
                document.getElementById('hud').classList.remove('hidden');
                document.getElementById('itemsDisplay').classList.remove('hidden');
                document.getElementById('instructions').classList.remove('hidden');
                document.getElementById('crosshair').classList.remove('hidden');
                document.getElementById('characterInfo').classList.remove('hidden');

                // Start game timer
                this.startTimer();
                this.updateUI();
                this.showStatusMessage(\`\${this.currentScenario.name} Emergency Started!\`, 'warning');
            }

            startTimer() {
                if (this.gameTimer) {
                    clearInterval(this.gameTimer);
                }

                this.gameTimer = setInterval(() => {
                    if (!this.gameActive) return;
                    
                    this.gameTime--;
                    this.updateUI();
                    
                    if (this.gameTime <= 0) {
                        this.endGame(false, 'Time ran out!');
                    }
                }, 1000);
            }

            updatePlayerMovement() {
                if (!this.gameActive || !this.player) return;

                const speed = this.isRunning ? 0.2 : 0.1;
                let moveVector = new THREE.Vector3();

                // Calculate movement direction based on camera rotation
                if (this.keys['KeyW']) moveVector.z -= 1;
                if (this.keys['KeyS']) moveVector.z += 1;
                if (this.keys['KeyA']) moveVector.x -= 1;
                if (this.keys['KeyD']) moveVector.x += 1;

                if (moveVector.length() > 0) {
                    moveVector.normalize();
                    moveVector.multiplyScalar(speed);
                    
                    // Apply camera rotation to movement
                    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
                    
                    this.player.position.add(moveVector);
                    
                    // Update movement status
                    document.getElementById('playerMovement').textContent = this.isRunning ? 'Running' : 'Walking';
                } else {
                    document.getElementById('playerMovement').textContent = 'Standing';
                }

                // Apply gravity and handle jumping
                this.playerVelocityY -= 0.01;
                this.player.position.y += this.playerVelocityY;

                // Ground collision
                if (this.player.position.y <= 1.5) {
                    this.player.position.y = 1.5;
                    this.playerVelocityY = 0;
                }

                // Update camera position
                this.updateCameraPosition();
                this.updatePlayerStatus();
                this.checkRoomLocation();
            }

            jump() {
                if (this.player && this.player.position.y <= 1.51) {
                    this.playerVelocityY = 0.15;
                }
            }

            updatePlayerStatus() {
                if (!this.player) return;

                const pos = this.player.position;
                document.getElementById('playerPos').textContent = 
                    \`X: \${pos.x.toFixed(1)}, Z: \${pos.z.toFixed(1)}\`;

                // Update direction based on camera rotation
                const rotation = this.camera.rotation.y;
                let direction = 'North';
                if (rotation > Math.PI/4 && rotation <= 3*Math.PI/4) direction = 'West';
                else if (rotation > 3*Math.PI/4 || rotation <= -3*Math.PI/4) direction = 'South';
                else if (rotation > -3*Math.PI/4 && rotation <= -Math.PI/4) direction = 'East';
                
                document.getElementById('playerDirection').textContent = direction;
            }

            checkRoomLocation() {
                if (!this.player) return;

                const playerPos = this.player.position;
                let currentLocation = 'Outdoor Campus';

                // Check if player is in any room
                for (const room of this.rooms) {
                    if (playerPos.x >= room.bounds.minX && playerPos.x <= room.bounds.maxX &&
                        playerPos.z >= room.bounds.minZ && playerPos.z <= room.bounds.maxZ &&
                        playerPos.y >= room.bounds.minY && playerPos.y <= room.bounds.maxY) {
                        currentLocation = room.name;
                        this.currentRoom = room;
                        break;
                    }
                }

                document.getElementById('location').textContent = \`Location: \${currentLocation}\`;
            }

            tryEnterRoom() {
                // Check if player is near a door
                for (const door of this.doors) {
                    const distance = this.player.position.distanceTo(door.mesh.position);
                    if (distance < 3) {
                        this.player.position.set(
                            door.entrance.x,
                            door.entrance.y,
                            door.entrance.z
                        );
                        this.showStatusMessage(\`Entered \${door.building} building\`, 'success');
                        break;
                    }
                }
            }

            tryCollectItem() {
                if (!this.gameActive || !this.player) return;

                for (let item of this.items) {
                    if (item.collected) continue;

                    const distance = this.player.position.distanceTo(item.mesh.position);
                    if (distance < 2) {
                        // Collect item
                        item.collected = true;
                        item.mesh.visible = false;
                        this.collectedItems.add(item.type);
                        this.score += 100;

                        // Update UI
                        const itemIcon = document.getElementById(\`item-\${item.type}\`);
                        if (itemIcon) {
                            itemIcon.classList.add('collected');
                        }

                        this.showStatusMessage(\`Collected: \${item.type.toUpperCase()}\`, 'success');
                        this.updateUI();

                        // Check win condition
                        if (this.collectedItems.size >= 6) {
                            this.checkEvacuationZone();
                        }
                        break;
                    }
                }
            }

            checkEvacuationZone() {
                if (!this.evacuationZone || !this.player) return;

                const distance = this.player.position.distanceTo(this.evacuationZone.position);
                if (distance < 5 && this.collectedItems.size >= 6) {
                    const bonus = this.gameTime * 10;
                    this.score += bonus;
                    this.endGame(true, \`Successful evacuation! Time bonus: \${bonus} points\`);
                }
            }

            animateItems() {
                const time = Date.now() * 0.005;
                
                this.items.forEach(item => {
                    if (!item.collected) {
                        // Floating animation
                        const floatY = item.mesh.userData.originalY + 
                                     Math.sin(time + item.mesh.userData.floatOffset) * 0.2;
                        item.mesh.position.y = floatY;
                        
                        // Rotation animation
                        item.mesh.rotation.y += 0.02;
                    }
                });
            }

            updateUI() {
                document.getElementById('timer').textContent = \`Time: \${this.gameTime}s\`;
                document.getElementById('score').textContent = \`Score: \${this.score}\`;
                document.getElementById('itemsCollected').textContent = 
                    \`Items: \${this.collectedItems.size}/\${this.itemTypes.length}\`;
                
                // Update health bar
                const healthFill = document.querySelector('.health-fill');
                if (healthFill) {
                    healthFill.style.width = \`\${this.health}%\`;
                }
            }

            showStatusMessage(message, type = 'info') {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'status-message';
                statusDiv.textContent = message;
                statusDiv.style.color = type === 'success' ? '#4caf50' : 
                                      type === 'warning' ? '#ff9800' : '#2196f3';
                
                document.getElementById('ui').appendChild(statusDiv);
                
                setTimeout(() => {
                    statusDiv.remove();
                }, 3000);
            }

            endGame(success, message) {
                this.gameActive = false;
                clearInterval(this.gameTimer);

                // Calculate final score
                if (success) {
                    this.score += this.health * 2;
                }

                // Show game over screen
                document.getElementById('hud').classList.add('hidden');
                document.getElementById('itemsDisplay').classList.add('hidden');
                document.getElementById('instructions').classList.add('hidden');
                document.getElementById('crosshair').classList.add('hidden');
                document.getElementById('characterInfo').classList.add('hidden');
                document.getElementById('gameOverScreen').classList.remove('hidden');

                document.getElementById('gameOverTitle').textContent = 
                    success ? 'Mission Accomplished!' : 'Training Incomplete';
                document.getElementById('gameOverMessage').textContent = message;
                document.getElementById('finalScore').textContent = \`Final Score: \${this.score}\`;
            }

            startGameLoop() {
                const animate = () => {
                    requestAnimationFrame(animate);
                    
                    if (this.gameActive) {
                        this.updatePlayerMovement();
                        this.animateItems();
                        this.checkEvacuationZone();
                    }
                    
                    this.renderer.render(this.scene, this.camera);
                };
                animate();
            }
        }

        // Global functions for UI
        function showStartScreen() {
            document.getElementById('scenarioScreen').classList.add('hidden');
            document.getElementById('gameOverScreen').classList.add('hidden');
            document.getElementById('startScreen').classList.remove('hidden');
        }

        function showScenarioSelect() {
            document.getElementById('startScreen').classList.add('hidden');
            document.getElementById('gameOverScreen').classList.add('hidden');
            document.getElementById('scenarioScreen').classList.remove('hidden');
        }

        function startGame(scenario) {
            game.startGame(scenario);
        }

        // Initialize the game
        const game = new EnhancedDisasterTraining();
    </script>
</body>
</html>
    `;

    // Since we're injecting HTML with scripts, we need to manually execute the scripts
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((script) => {
      if (script.src) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        document.head.appendChild(newScript);
      } else {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
      }
    });

    return () => {
      // Cleanup when component unmounts
      scripts.forEach((script) => {
        const addedScripts = document.head.querySelectorAll(`script[src="${script.src}"]`);
        addedScripts.forEach(s => s.remove());
      });
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default DisasterTrainingGame;