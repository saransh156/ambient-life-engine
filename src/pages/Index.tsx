import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DisasterTrainingGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the game UI structure
    containerRef.current.innerHTML = `
      <div id="gameContainer" style="position: relative; width: 100vw; height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); overflow: hidden; color: white; user-select: none;">
        <!-- UI Overlay -->
        <div id="ui" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;">
          <!-- Start Screen -->
          <div id="startScreen" class="screen" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95)); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 200; backdrop-filter: blur(20px); pointer-events: auto;">
            <h1 style="font-size: 56px; margin-bottom: 20px; text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.8); background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffaa44); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Enhanced Disaster Training</h1>
            <p style="font-size: 18px; margin: 10px 0; max-width: 700px; text-align: center; line-height: 1.6;">Experience realistic emergency scenarios in a detailed 3D environment with buildings and interiors.</p>
            <p style="font-size: 18px; margin: 10px 0; max-width: 700px; text-align: center; line-height: 1.6;">Learn life-saving skills through immersive disaster preparedness training.</p>
            <button class="button" onclick="showScenarioSelect()" style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3); font-weight: bold;">Start Training</button>
          </div>

          <!-- Scenario Selection Screen -->
          <div id="scenarioScreen" class="screen hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95)); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 200; backdrop-filter: blur(20px); pointer-events: auto;">
            <h1 style="font-size: 56px; margin-bottom: 20px; text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.8); background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffaa44); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Select Emergency Scenario</h1>
            <p style="font-size: 18px; margin: 10px 0; max-width: 700px; text-align: center; line-height: 1.6;">Choose a disaster scenario to practice emergency response</p>
            
            <button class="scenario-button" onclick="startGame('earthquake')" style="background: linear-gradient(45deg, #4ecdc4, #44a08d); min-width: 300px; padding: 20px 30px; font-size: 20px; margin: 15px; box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3); color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-weight: bold;">
              🏫 Earthquake at School
              <div style="font-size: 14px; color: #aaa; margin-top: 8px;">Navigate realistic buildings and classrooms during seismic activity</div>
            </button>
            
            <button class="scenario-button" onclick="startGame('fire')" style="background: linear-gradient(45deg, #4ecdc4, #44a08d); min-width: 300px; padding: 20px 30px; font-size: 20px; margin: 15px; box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3); color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-weight: bold;">
              🔥 Fire Emergency
              <div style="font-size: 14px; color: #aaa; margin-top: 8px;">Escape through smoke-filled corridors and rooms</div>
            </button>
            
            <button class="scenario-button" onclick="startGame('flood')" style="background: linear-gradient(45deg, #4ecdc4, #44a08d); min-width: 300px; padding: 20px 30px; font-size: 20px; margin: 15px; box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3); color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-weight: bold;">
              🌊 Flood Evacuation
              <div style="font-size: 14px; color: #aaa; margin-top: 8px;">Navigate flooded buildings and find higher ground</div>
            </button>
            
            <button class="scenario-button" onclick="startGame('tornado')" style="background: linear-gradient(45deg, #4ecdc4, #44a08d); min-width: 300px; padding: 20px 30px; font-size: 20px; margin: 15px; box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3); color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; font-weight: bold;">
              🌪️ Tornado Warning
              <div style="font-size: 14px; color: #aaa; margin-top: 8px;">Seek shelter in interior rooms and basements</div>
            </button>
            
            <button class="button" onclick="showStartScreen()" style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3); font-weight: bold;">Back</button>
          </div>

          <!-- Game Over Screen -->
          <div id="gameOverScreen" class="screen hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 40, 0.95)); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 200; backdrop-filter: blur(20px); pointer-events: auto;">
            <h1 id="gameOverTitle" style="font-size: 56px; margin-bottom: 20px; text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.8); background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffaa44); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Training Complete</h1>
            <p id="gameOverMessage" style="font-size: 18px; margin: 10px 0; max-width: 700px; text-align: center; line-height: 1.6;"></p>
            <p id="finalScore" style="font-size: 18px; margin: 10px 0; max-width: 700px; text-align: center; line-height: 1.6;"></p>
            <button class="button" onclick="showScenarioSelect()" style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3); font-weight: bold;">Try Another Scenario</button>
            <button class="button" onclick="showStartScreen()" style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 25px; cursor: pointer; margin: 10px; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3); font-weight: bold;">Main Menu</button>
          </div>

          <!-- HUD -->
          <div id="hud" class="hidden" style="position: absolute; top: 15px; left: 15px; background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9)); padding: 20px; border-radius: 15px; backdrop-filter: blur(15px); border: 2px solid rgba(100, 200, 255, 0.3); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); pointer-events: auto;">
            <div id="timer" style="font-size: 28px; font-weight: bold; color: #ff6b6b; text-shadow: 2px 2px 8px rgba(255, 107, 107, 0.5); margin-bottom: 10px;">Time: 180s</div>
            <div id="score" style="font-size: 18px; margin: 8px 0; color: #4ecdc4; display: flex; align-items: center; gap: 10px;">Score: 0</div>
            <div id="itemsCollected" style="font-size: 18px; margin: 8px 0; color: #4ecdc4; display: flex; align-items: center; gap: 10px;">Items: 0/8</div>
            <div id="location" style="font-size: 18px; margin: 8px 0; color: #4ecdc4; display: flex; align-items: center; gap: 10px;">Location: Main Building</div>
            <div id="health" style="font-size: 18px; margin: 8px 0; color: #4ecdc4; display: flex; align-items: center; gap: 10px;">
              Health: <div style="width: 100px; height: 8px; background: rgba(255, 255, 255, 0.2); border-radius: 4px; overflow: hidden;"><div class="health-fill" style="height: 100%; background: linear-gradient(90deg, #44ff44, #88ff88); width: 100%; transition: width 0.3s ease;"></div></div>
            </div>
          </div>

          <!-- Items Display -->
          <div id="itemsDisplay" class="hidden" style="position: absolute; top: 15px; right: 15px; background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9)); padding: 20px; border-radius: 15px; backdrop-filter: blur(15px); border: 2px solid rgba(100, 200, 255, 0.3); min-width: 280px; pointer-events: auto;">
            <div class="item-category">
              <h4 style="color: #ffaa44; margin-bottom: 8px; font-size: 16px; border-bottom: 1px solid rgba(255, 170, 68, 0.3); padding-bottom: 4px;">🎒 Emergency Supplies</h4>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-flashlight" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">🔦</div>
                <div class="item-info">Emergency Flashlight</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-firstaid" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">🏥</div>
                <div class="item-info">First Aid Kit</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-water" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">💧</div>
                <div class="item-info">Water Bottle</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-food" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">🍎</div>
                <div class="item-info">Emergency Food</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-radio" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">📻</div>
                <div class="item-info">Emergency Radio</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-blanket" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">🧥</div>
                <div class="item-info">Emergency Blanket</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-whistle" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">🎺</div>
                <div class="item-info">Emergency Whistle</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0; padding: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                <div class="item-icon" id="item-documents" style="width: 35px; height: 35px; border: 2px solid #555; border-radius: 8px; background: #333; text-align: center; line-height: 31px; font-size: 16px; flex-shrink: 0;">📄</div>
                <div class="item-info">Important Documents</div>
              </div>
            </div>
          </div>

          <!-- Character Info -->
          <div id="characterInfo" class="hidden" style="position: absolute; bottom: 20px; right: 20px; background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9)); padding: 15px; border-radius: 10px; backdrop-filter: blur(15px); border: 2px solid rgba(100, 200, 255, 0.3); font-size: 14px; color: #4ecdc4; pointer-events: auto;">
            <h4>👤 Character Status</h4>
            <div>Position: <span id="playerPos">Building Entrance</span></div>
            <div>Movement: <span id="playerMovement">Standing</span></div>
            <div>Looking: <span id="playerDirection">North</span></div>
          </div>

          <!-- Instructions -->
          <div id="instructions" class="hidden" style="position: absolute; bottom: 20px; left: 20px; background: linear-gradient(145deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 40, 0.9)); padding: 15px; border-radius: 10px; backdrop-filter: blur(15px); border: 2px solid rgba(100, 200, 255, 0.3); font-size: 12px; max-width: 250px; line-height: 1.4; pointer-events: auto;">
            <h3>Controls:</h3>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Move:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">WASD</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Look:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">Mouse</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Run:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">Shift</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Jump:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">Space</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Collect:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">Click</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Enter Room:</span>
              <span style="background: rgba(255, 255, 255, 0.1); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffaa44;">F</span>
            </div>
          </div>

          <!-- Crosshair -->
          <div id="crosshair" class="hidden" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; pointer-events: none; z-index: 150;">
            <div style="position: absolute; top: 50%; left: 8px; transform: translateY(-50%); width: 4px; height: 2px; background: rgba(255, 255, 255, 0.8); box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);"></div>
            <div style="position: absolute; left: 50%; top: 8px; transform: translateX(-50%); width: 2px; height: 4px; background: rgba(255, 255, 255, 0.8); box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);"></div>
          </div>
        </div>
      </div>

      <style>
        .hidden { display: none !important; }
        .item-icon.collected { border-color: #4ecdc4 !important; background: linear-gradient(145deg, #4ecdc4, #44b3a8) !important; color: white !important; box-shadow: 0 2px 10px rgba(78, 205, 196, 0.4) !important; }
        .button:hover, .scenario-button:hover { transform: translateY(-3px); }
      </style>
    `;

    // Enhanced Disaster Training Game Class
    class EnhancedDisasterTraining {
      private scene: THREE.Scene;
      private camera: THREE.PerspectiveCamera;
      private renderer: THREE.WebGLRenderer;
      private player: THREE.Group | null = null;
      private gameActive = false;
      private gameTime = 180;
      private score = 0;
      private health = 100;
      private keys: {[key: string]: boolean} = {};
      private mouseMovement = { x: 0, y: 0 };
      private playerVelocityY = 0;
      private isRunning = false;
      private pointerLocked = false;
      private currentRoom: any = null;
      private gameTimer: any = null;
      private items: any[] = [];
      private collectedItems = new Set();
      private buildings: THREE.Group[] = [];
      private rooms: any[] = [];
      private doors: any[] = [];
      private evacuationZone: THREE.Mesh | null = null;
      private ambientLight: THREE.AmbientLight;
      private directionalLight: THREE.DirectionalLight;
      private cameraOffset = new THREE.Vector3(0, 1, 0);
      private currentScenario: any = null;
      
      private scenarios = {
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

      private itemTypes = ['flashlight', 'firstaid', 'water', 'food', 'radio', 'blanket', 'whistle', 'documents'];

      constructor() {
        this.initThreeJS();
        this.setupControls();
        this.setupUI();
        this.startGameLoop();
      }

      private initThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('gameContainer')!.appendChild(this.renderer.domElement);

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

      public startGame(scenarioName: string) {
        this.currentScenario = this.scenarios[scenarioName as keyof typeof this.scenarios];
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
        document.getElementById('startScreen')!.classList.add('hidden');
        document.getElementById('scenarioScreen')!.classList.add('hidden');
        document.getElementById('gameOverScreen')!.classList.add('hidden');
        document.getElementById('hud')!.classList.remove('hidden');
        document.getElementById('itemsDisplay')!.classList.remove('hidden');
        document.getElementById('instructions')!.classList.remove('hidden');
        document.getElementById('crosshair')!.classList.remove('hidden');
        document.getElementById('characterInfo')!.classList.remove('hidden');

        // Start game timer
        this.startTimer();
        this.updateUI();
        this.showStatusMessage(`${this.currentScenario.name} Emergency Started!`, 'warning');
      }

      private createEnvironment() {
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
      }

      private createRealisticBuildings() {
        // Clear existing buildings
        this.buildings.forEach(building => this.scene.remove(building));
        this.buildings = [];
        this.rooms = [];
        this.doors = [];

        // Main School Building
        this.createMainBuilding();
        
        // Other buildings
        this.createGymnasium();
        this.createCafeteria();
        this.createLibrary();
        this.createAdminBuilding();
      }

      private createMainBuilding() {
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

        // Main entrance door
        const doorGeometry = new THREE.BoxGeometry(3, 5, 0.5);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2.5, 10.25);
        buildingGroup.add(door);
        this.doors.push({ mesh: door, building: 'main', entrance: { x: 0, y: 1, z: 8 } });

        this.scene.add(buildingGroup);
        this.buildings.push(buildingGroup);
      }

      private createGymnasium() {
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

        this.scene.add(gymGroup);
        this.buildings.push(gymGroup);
      }

      private createCafeteria() {
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

        this.scene.add(cafeteriaGroup);
        this.buildings.push(cafeteriaGroup);
      }

      private createLibrary() {
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

        this.scene.add(libraryGroup);
        this.buildings.push(libraryGroup);
      }

      private createAdminBuilding() {
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

      private createVisibleCharacter() {
        if (this.player) {
          this.scene.remove(this.player);
        }

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

        this.player = playerGroup;
        this.player.position.set(0, 1.5, 8);
        this.scene.add(this.player);

        this.setupFirstPersonCamera();
      }

      private setupFirstPersonCamera() {
        this.cameraOffset = new THREE.Vector3(0, 1, 0);
        this.updateCameraPosition();
      }

      private updateCameraPosition() {
        if (this.player) {
          const playerPos = this.player.position.clone();
          playerPos.add(this.cameraOffset);
          this.camera.position.copy(playerPos);
        }
      }

      private spawnItems() {
        this.items.forEach(item => this.scene.remove(item.mesh));
        this.items = [];
        this.collectedItems.clear();

        const itemPositions = [
          { x: -8, y: 1, z: 2 },
          { x: 6, y: 1, z: -3 },
          { x: -2, y: 1, z: 9 },
          { x: 38, y: 1, z: 2 },
          { x: -32, y: 1, z: -2 },
          { x: 2, y: 1, z: -32 },
          { x: 33, y: 1, z: 28 },
          { x: 15, y: 1, z: 15 }
        ];

        this.itemTypes.forEach((type, index) => {
          const position = itemPositions[index];
          const itemGroup = new THREE.Group();

          const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
          const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.3
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          itemGroup.add(glow);

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
          itemGroup.userData = {
            type: type,
            originalY: position.y,
            floatOffset: Math.random() * Math.PI * 2
          };

          this.scene.add(itemGroup);
          this.items.push({ mesh: itemGroup, type: type, collected: false });
        });
      }

      private createEvacuationZone() {
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
      }

      private setupControls() {
        window.addEventListener('keydown', (event) => {
          this.keys[event.code] = true;
          if (event.code === 'Space') {
            event.preventDefault();
            this.jump();
          }
          if (event.code === 'ShiftLeft') {
            this.isRunning = true;
          }
        });

        window.addEventListener('keyup', (event) => {
          this.keys[event.code] = false;
          if (event.code === 'ShiftLeft') {
            this.isRunning = false;
          }
        });

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
          
          this.camera.rotation.y -= event.movementX * 0.002;
          this.camera.rotation.x -= event.movementY * 0.002;
          this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        });
      }

      private setupUI() {
        document.getElementById('startScreen')!.classList.remove('hidden');
      }

      private startTimer() {
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

      private updatePlayerMovement() {
        if (!this.gameActive || !this.player) return;

        const speed = this.isRunning ? 0.2 : 0.1;
        let moveVector = new THREE.Vector3();

        if (this.keys['KeyW']) moveVector.z -= 1;
        if (this.keys['KeyS']) moveVector.z += 1;
        if (this.keys['KeyA']) moveVector.x -= 1;
        if (this.keys['KeyD']) moveVector.x += 1;

        if (moveVector.length() > 0) {
          moveVector.normalize();
          moveVector.multiplyScalar(speed);
          moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
          this.player.position.add(moveVector);
        }

        // Apply gravity
        this.playerVelocityY -= 0.01;
        this.player.position.y += this.playerVelocityY;

        // Ground collision
        if (this.player.position.y <= 1.5) {
          this.player.position.y = 1.5;
          this.playerVelocityY = 0;
        }

        this.updateCameraPosition();
        this.updatePlayerStatus();
      }

      private jump() {
        if (this.player && this.player.position.y <= 1.51) {
          this.playerVelocityY = 0.15;
        }
      }

      private updatePlayerStatus() {
        if (!this.player) return;

        const pos = this.player.position;
        document.getElementById('playerPos')!.textContent = 
          `X: ${pos.x.toFixed(1)}, Z: ${pos.z.toFixed(1)}`;
      }

      private tryCollectItem() {
        if (!this.gameActive || !this.player) return;

        for (let item of this.items) {
          if (item.collected) continue;

          const distance = this.player.position.distanceTo(item.mesh.position);
          if (distance < 2) {
            item.collected = true;
            item.mesh.visible = false;
            this.collectedItems.add(item.type);
            this.score += 100;

            const itemIcon = document.getElementById(`item-${item.type}`);
            if (itemIcon) {
              itemIcon.classList.add('collected');
            }

            this.showStatusMessage(`Collected: ${item.type.toUpperCase()}`, 'success');
            this.updateUI();

            if (this.collectedItems.size >= 6) {
              this.checkEvacuationZone();
            }
            break;
          }
        }
      }

      private checkEvacuationZone() {
        if (!this.evacuationZone || !this.player) return;

        const distance = this.player.position.distanceTo(this.evacuationZone.position);
        if (distance < 5 && this.collectedItems.size >= 6) {
          const bonus = this.gameTime * 10;
          this.score += bonus;
          this.endGame(true, `Successful evacuation! Time bonus: ${bonus} points`);
        }
      }

      private animateItems() {
        const time = Date.now() * 0.005;
        
        this.items.forEach(item => {
          if (!item.collected) {
            const floatY = item.mesh.userData.originalY + 
                         Math.sin(time + item.mesh.userData.floatOffset) * 0.2;
            item.mesh.position.y = floatY;
            item.mesh.rotation.y += 0.02;
          }
        });
      }

      private updateUI() {
        document.getElementById('timer')!.textContent = `Time: ${this.gameTime}s`;
        document.getElementById('score')!.textContent = `Score: ${this.score}`;
        document.getElementById('itemsCollected')!.textContent = 
          `Items: ${this.collectedItems.size}/${this.itemTypes.length}`;
        
        const healthFill = document.querySelector('.health-fill') as HTMLElement;
        if (healthFill) {
          healthFill.style.width = `${this.health}%`;
        }
      }

      private showStatusMessage(message: string, type = 'info') {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
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
          color: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
          animation: fadeInOut 3s ease-in-out forwards;
        `;
        statusDiv.textContent = message;
        
        document.getElementById('ui')!.appendChild(statusDiv);
        
        setTimeout(() => {
          statusDiv.remove();
        }, 3000);
      }

      private endGame(success: boolean, message: string) {
        this.gameActive = false;
        clearInterval(this.gameTimer);

        if (success) {
          this.score += this.health * 2;
        }

        document.getElementById('hud')!.classList.add('hidden');
        document.getElementById('itemsDisplay')!.classList.add('hidden');
        document.getElementById('instructions')!.classList.add('hidden');
        document.getElementById('crosshair')!.classList.add('hidden');
        document.getElementById('characterInfo')!.classList.add('hidden');
        document.getElementById('gameOverScreen')!.classList.remove('hidden');

        document.getElementById('gameOverTitle')!.textContent = 
          success ? 'Mission Accomplished!' : 'Training Incomplete';
        document.getElementById('gameOverMessage')!.textContent = message;
        document.getElementById('finalScore')!.textContent = `Final Score: ${this.score}`;
      }

      private startGameLoop() {
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

    // Initialize the game
    const game = new EnhancedDisasterTraining();
    gameInstanceRef.current = game;

    // Global functions for UI (attach to window for onclick handlers)
    (window as any).showStartScreen = () => {
      document.getElementById('scenarioScreen')!.classList.add('hidden');
      document.getElementById('gameOverScreen')!.classList.add('hidden');
      document.getElementById('startScreen')!.classList.remove('hidden');
    };

    (window as any).showScenarioSelect = () => {
      document.getElementById('startScreen')!.classList.add('hidden');
      document.getElementById('gameOverScreen')!.classList.add('hidden');
      document.getElementById('scenarioScreen')!.classList.remove('hidden');
    };

    (window as any).startGame = (scenario: string) => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.startGame(scenario);
      }
    };

    return () => {
      // Cleanup
      if (gameInstanceRef.current) {
        gameInstanceRef.current = null;
      }
      // Clean up global functions
      delete (window as any).showStartScreen;
      delete (window as any).showScenarioSelect;
      delete (window as any).startGame;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default DisasterTrainingGame;