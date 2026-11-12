import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  getGateBannerTexture,
  getVietnamFlagTexture,
  getSchoolWallTexture,
  getRoofTileTexture,
  getCourtyardPaverTexture,
  getBasketballCourtTexture,
  getFootballTurfTexture,
  getBlackboardTexture,
  getSteleTexture,
} from './proceduralTextures';
import { CAMPUS_LOCATIONS } from '../data/campusData';
import { CampusLocation } from '../types/campus';
import { soundManager } from '../audio/soundSynthesizer';

// Scratch vectors for zero-garbage animation loop
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _vCam = new THREE.Vector3();

export interface GameControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
}

export type CameraViewMode = 'third_person' | 'drone' | 'photo';

export class CampusScene3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private frameId: number = 0;
  private clock: THREE.Clock;
  private isSoftwareGl: boolean = false;

  // Player & Movement (Starting outside gate looking into schoolyard)
  private playerGroup: THREE.Group;
  private playerPos = new THREE.Vector3(0, 0, 53);
  private playerVel = new THREE.Vector3(0, 0, 0);
  private playerRotY = Math.PI; // Facing into the schoolyard (towards -Z)
  private isGrounded = true;
  private walkCycle = 0;
  private leftLeg: THREE.Mesh | null = null;
  private rightLeg: THREE.Mesh | null = null;
  private leftArm: THREE.Mesh | null = null;
  private rightArm: THREE.Mesh | null = null;

  // Controls & Camera (Behind player's back looking from outside gate into schoolyard)
  public controls: GameControls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
  };
  public cameraMode: CameraViewMode = 'third_person';
  public cameraYaw = 0; // Behind player (cz = playerPos.z + dist, looking forward towards -Z)
  public cameraPitch = 0.22;
  public cameraDist = 8.5;

  // Interactive markers & buildings
  private flagMesh: THREE.Mesh | null = null;
  private locationMarkers: { id: string; group: THREE.Group; basePos: THREE.Vector3 }[] = [];
  public buildingGroups: Map<string, THREE.Object3D> = new Map();
  public nearbyLocationId: string | null = null;

  // Basketball & Soccer Mini-games in scene
  private basketballs: { mesh: THREE.Mesh; vel: THREE.Vector3; active: boolean }[] = [];
  private hoopPos = new THREE.Vector3(-16, 3.05, -60);
  private soccerGoalPos = new THREE.Vector3(16, 1.1, -56);
  public onScoreBasket?: () => void;
  public onScoreGoal?: () => void;
  public onNearbyLocationChange?: (locId: string | null) => void;

  // Time of Day
  private dirLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  public timeOfDay: 'day' | 'golden' | 'sunset' = 'day';

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#93C5FD'); // Vietnamese blue sky
    this.scene.fog = new THREE.FogExp2('#BAE6FD', 0.009);

    this.camera = new THREE.PerspectiveCamera(
      55,
      this.container.clientWidth / this.container.clientHeight,
      0.2,
      350
    );

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    this.setupLighting();

    // 5. Build Campus World
    this.playerGroup = new THREE.Group();
    this.buildGroundAndCourtyard();
    this.buildSchoolGate();
    this.buildFlagpoleAndCourtyard();
    this.buildAcademicBlocks();
    this.buildLibraryAndLabs();
    this.buildSportsComplex();
    this.buildCanteenAndServices();
    this.buildAdminAndTeachersLounge();
    this.buildCampusTreesAndBenches();
    this.buildPlayerCharacter();
    this.buildLocationMarkers();

    // 6. Bind Listeners & Pointer Drag Camera Orbit
    this.initPointerDrag();
    window.addEventListener('resize', this.onResize);
    this.startLoop();
  }

  private isDragging = false;
  private prevPointerX = 0;
  private prevPointerY = 0;

  private onPointerDown = (e: PointerEvent) => {
    if (e.target === this.renderer.domElement) {
      this.isDragging = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.prevPointerX;
    const dy = e.clientY - this.prevPointerY;
    this.prevPointerX = e.clientX;
    this.prevPointerY = e.clientY;

    this.cameraYaw -= dx * 0.005;
    this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * 0.003, 0.05, 0.75);
  };

  private onPointerUp = () => {
    this.isDragging = false;
  };

  private initPointerDrag() {
    this.container.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private setupLighting() {
    this.hemiLight = new THREE.HemisphereLight('#E0F2FE', '#4B5563', 0.85);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight('#FEF08A', 1.8);
    this.dirLight.position.set(45, 60, 40);
    this.dirLight.castShadow = !this.isSoftwareGl;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 5;
    this.dirLight.shadow.camera.far = 180;
    const d = 60;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);
  }

  public setTimeOfDay(preset: 'day' | 'golden' | 'sunset') {
    this.timeOfDay = preset;
    if (preset === 'day') {
      this.scene.background = new THREE.Color('#7DD3FC');
      this.scene.fog = new THREE.FogExp2('#BAE6FD', 0.009);
      this.dirLight.color.set('#FEF08A');
      this.dirLight.intensity = 1.8;
      this.dirLight.position.set(45, 60, 40);
      this.hemiLight.color.set('#E0F2FE');
    } else if (preset === 'golden') {
      this.scene.background = new THREE.Color('#FDBA74');
      this.scene.fog = new THREE.FogExp2('#FED7AA', 0.008);
      this.dirLight.color.set('#F97316');
      this.dirLight.intensity = 2.0;
      this.dirLight.position.set(65, 30, 20);
      this.hemiLight.color.set('#FFEDD5');
    } else {
      // Sunset
      this.scene.background = new THREE.Color('#C084FC');
      this.scene.fog = new THREE.FogExp2('#DDD6FE', 0.008);
      this.dirLight.color.set('#F43F5E');
      this.dirLight.intensity = 1.4;
      this.dirLight.position.set(70, 18, 10);
      this.hemiLight.color.set('#FCE7F3');
    }
  }

  // --- 3D Modeling Procedures ---

  private buildGroundAndCourtyard() {
    // Large perimeter ground (prevents empty void)
    const perimeterGeo = new THREE.PlaneGeometry(280, 280);
    const perimeterMat = new THREE.MeshStandardMaterial({
      color: '#15803D',
      roughness: 0.85,
    });
    const perimeter = new THREE.Mesh(perimeterGeo, perimeterMat);
    perimeter.rotation.x = -Math.PI / 2;
    perimeter.position.y = -0.05;
    perimeter.receiveShadow = true;
    this.scene.add(perimeter);

    // Main courtyard pavers
    const paverTex = getCourtyardPaverTexture();
    const courtGeo = new THREE.PlaneGeometry(90, 110);
    const courtMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      roughness: 0.7,
      metalness: 0.05,
    });
    const court = new THREE.Mesh(courtGeo, courtMat);
    court.rotation.x = -Math.PI / 2;
    court.position.set(0, 0, 0);
    court.receiveShadow = true;
    this.scene.add(court);

    // Decorative brick pathways
    const pathMat = new THREE.MeshStandardMaterial({ color: '#B45309', roughness: 0.8 });
    const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(10, 80), pathMat);
    mainAvenue.rotation.x = -Math.PI / 2;
    mainAvenue.position.set(0, 0.01, 15);
    mainAvenue.receiveShadow = true;
    this.scene.add(mainAvenue);
  }

  private buildSchoolGate() {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 48);

    // Left and Right main brick pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      map: getSchoolWallTexture(),
      roughness: 0.6,
    });
    const pillarCapMat = new THREE.MeshStandardMaterial({ color: '#B91C1C', roughness: 0.5 });

    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2, 6.5, 2), pillarMat);
    p1.position.set(-6.5, 3.25, 0);
    p1.castShadow = true;
    gateGroup.add(p1);

    const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.2, 4), pillarCapMat);
    c1.position.set(-6.5, 7.1, 0);
    c1.rotation.y = Math.PI / 4;
    gateGroup.add(c1);

    const p2 = p1.clone();
    p2.position.set(6.5, 3.25, 0);
    gateGroup.add(p2);

    const c2 = c1.clone();
    c2.position.set(6.5, 7.1, 0);
    gateGroup.add(c2);

    // Main Overhead Arch with school name
    const archMat = new THREE.MeshStandardMaterial({
      map: getGateBannerTexture(),
      roughness: 0.4,
      metalness: 0.1,
    });
    const arch = new THREE.Mesh(new THREE.BoxGeometry(11.5, 2.2, 0.8), archMat);
    arch.position.set(0, 5.8, 0);
    arch.castShadow = true;
    gateGroup.add(arch);

    // Wrought iron gate doors (open welcoming angle)
    const ironMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.3, metalness: 0.8 });
    const gateDoorLeft = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.5, 0.15), ironMat);
    gateDoorLeft.position.set(-3.5, 1.75, -1.2);
    gateDoorLeft.rotation.y = -Math.PI / 3;
    gateGroup.add(gateDoorLeft);

    const gateDoorRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.5, 0.15), ironMat);
    gateDoorRight.position.set(3.5, 1.75, -1.2);
    gateDoorRight.rotation.y = Math.PI / 3;
    gateGroup.add(gateDoorRight);

    // Security guard house
    const guardHouse = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 3), pillarMat);
    guardHouse.position.set(9.5, 1.6, -1);
    guardHouse.castShadow = true;
    gateGroup.add(guardHouse);

    const guardRoof = new THREE.Mesh(new THREE.ConeGeometry(3, 1.4, 4), pillarCapMat);
    guardRoof.position.set(9.5, 3.9, -1);
    guardRoof.rotation.y = Math.PI / 4;
    gateGroup.add(guardRoof);

    // Hàn Thuyên Stele Monument beside gate
    const steleGroup = new THREE.Group();
    steleGroup.position.set(-11, 0, -2);

    const steleBase = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 3), new THREE.MeshStandardMaterial({ color: '#475569' }));
    steleBase.position.y = 0.4;
    steleGroup.add(steleBase);

    const steleMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 4.2, 0.5),
      [
        new THREE.MeshStandardMaterial({ color: '#334155' }),
        new THREE.MeshStandardMaterial({ color: '#334155' }),
        new THREE.MeshStandardMaterial({ color: '#334155' }),
        new THREE.MeshStandardMaterial({ color: '#334155' }),
        new THREE.MeshStandardMaterial({ map: getSteleTexture(), roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: '#334155' }),
      ]
    );
    steleMesh.position.set(0, 2.9, 0);
    steleMesh.castShadow = true;
    steleGroup.add(steleMesh);

    gateGroup.add(steleGroup);
    this.scene.add(gateGroup);
    this.buildingGroups.set('gate', gateGroup);
  }

  private buildFlagpoleAndCourtyard() {
    const flagGroup = new THREE.Group();
    flagGroup.position.set(0, 0, 12);

    // 3-tier stepped honor podium
    const marbleMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.4 });
    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 7), marbleMat);
    tier1.position.y = 0.15;
    tier1.receiveShadow = true;
    flagGroup.add(tier1);

    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 5.2), marbleMat);
    tier2.position.y = 0.45;
    tier2.receiveShadow = true;
    flagGroup.add(tier2);

    const tier3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 3.6), marbleMat);
    tier3.position.y = 0.75;
    tier3.receiveShadow = true;
    flagGroup.add(tier3);

    // 18-meter stainless steel flagpole
    const poleMat = new THREE.MeshStandardMaterial({ color: '#F1F5F9', metalness: 0.95, roughness: 0.15 });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 17, 16), poleMat);
    mast.position.y = 9.25;
    mast.castShadow = true;
    flagGroup.add(mast);

    // Golden finial ball at top
    const goldMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.95, roughness: 0.1 });
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), goldMat);
    finial.position.y = 17.8;
    flagGroup.add(finial);

    // Waving Vietnam National Flag (Cờ Đỏ Sao Vàng)
    const flagGeo = new THREE.PlaneGeometry(3.4, 2.2, 16, 10);
    const flagMat = new THREE.MeshStandardMaterial({
      map: getVietnamFlagTexture(),
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    this.flagMesh = new THREE.Mesh(flagGeo, flagMat);
    this.flagMesh.position.set(1.75, 16.2, 0);
    this.flagMesh.castShadow = true;
    flagGroup.add(this.flagMesh);

    this.scene.add(flagGroup);
    this.buildingGroups.set('flagpole', flagGroup);
  }

  private buildAcademicBlocks() {
    const wallTex = getSchoolWallTexture();
    const roofTex = getRoofTileTexture();

    // Helper to build a 3-tier classroom block
    const createClassBlock = (id: string, name: string, posX: number, posZ: number, rotY: number, length: number) => {
      const block = new THREE.Group();
      block.position.set(posX, 0, posZ);
      block.rotation.y = rotY;

      const buildingMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.7 });
      const roofMat = new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.5 });
      const windowMat = new THREE.MeshStandardMaterial({ color: '#38BDF8', roughness: 0.2, metalness: 0.6 });

      // Main 3-floor building body
      const height = 11;
      const width = 11;
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), buildingMat);
      body.position.y = height / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      block.add(body);

      // Louvered corridors & balconies along front face
      const balconyMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.4 });
      for (let floor = 1; floor <= 3; floor++) {
        const floorY = (floor - 1) * 3.6 + 1.2;
        const bal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, length - 2), balconyMat);
        bal.position.set(width / 2 + 0.8, floorY, 0);
        bal.castShadow = true;
        block.add(bal);

        // Windows / doors along corridor
        const numWindows = Math.floor(length / 4.5);
        for (let w = 0; w < numWindows; w++) {
          const zOffset = -length / 2 + 3 + w * 4.5;
          const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), windowMat);
          win.position.set(width / 2 + 0.05, floorY + 1.4, zOffset);
          win.rotation.y = Math.PI / 2;
          block.add(win);
        }
      }

      // Hip Roof with Vietnamese Terracotta tiles
      const roof = new THREE.Mesh(new THREE.ConeGeometry(width * 0.9, 3.8, 4), roofMat);
      roof.scale.set(1.2, 1, (length / width) * 1.05);
      roof.position.set(0, height + 1.9, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      block.add(roof);

      // Large school clock & slogan sign in center
      const clockMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 24), new THREE.MeshStandardMaterial({ color: '#FFFFFF' }));
      clockMesh.rotation.x = Math.PI / 2;
      clockMesh.position.set(width / 2 + 0.1, height - 1.2, 0);
      block.add(clockMesh);

      // Classroom interior preview visible through open doorway
      const boardMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.6), new THREE.MeshStandardMaterial({ map: getBlackboardTexture() }));
      boardMesh.position.set(-width / 2 + 0.1, 3.2, 0);
      boardMesh.rotation.y = Math.PI / 2;
      block.add(boardMesh);

      this.scene.add(block);
      this.buildingGroups.set(id, block);
      return block;
    };

    // Block A (West Wing) - 10th & 11th grade
    createClassBlock('block-a', 'Block A', -28, 10, Math.PI / 2, 42);

    // Block B (East Wing) - 12th grade
    createClassBlock('block-b', 'Block B', 28, 10, -Math.PI / 2, 42);

    // Block C (North Rear Wing) - Department classrooms & Language
    createClassBlock('block-c', 'Block C', 0, -32, 0, 52);
  }

  private buildLibraryAndLabs() {
    const wallTex = getSchoolWallTexture();
    const glassMat = new THREE.MeshStandardMaterial({ color: '#0EA5E9', roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.85 });

    // 1. Han Thuyen Library (Modern glass & green study hub)
    const libGroup = new THREE.Group();
    libGroup.position.set(-22, 0, -18);

    const libBody = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 13), new THREE.MeshStandardMaterial({ map: wallTex }));
    libBody.position.y = 3.75;
    libBody.castShadow = true;
    libGroup.add(libBody);

    // Glass wall facade
    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 0.2), glassMat);
    glassFacade.position.set(0, 3.5, 6.6);
    libGroup.add(glassFacade);

    // Wooden pergola reading porch
    const pergolaMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.7 });
    for (let i = -6; i <= 6; i += 3) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 0.3), pergolaMat);
      beam.position.set(i, 1.9, 8.5);
      libGroup.add(beam);
    }
    const pergolaRoof = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 3), pergolaMat);
    pergolaRoof.position.set(0, 3.8, 8.5);
    libGroup.add(pergolaRoof);

    this.scene.add(libGroup);
    this.buildingGroups.set('library', libGroup);

    // 2. Science Labs
    const labGroup = new THREE.Group();
    labGroup.position.set(22, 0, -18);

    const labBody = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 13), new THREE.MeshStandardMaterial({ map: wallTex }));
    labBody.position.y = 3.75;
    labBody.castShadow = true;
    labGroup.add(labBody);

    const labRoof = new THREE.Mesh(new THREE.ConeGeometry(13, 3.2, 4), new THREE.MeshStandardMaterial({ map: getRoofTileTexture() }));
    labRoof.scale.set(1.2, 1, 0.9);
    labRoof.position.set(0, 9.1, 0);
    labRoof.rotation.y = Math.PI / 4;
    labGroup.add(labRoof);

    this.scene.add(labGroup);
    this.buildingGroups.set('science-lab', labGroup);

    // 3. Computer & AI Lab Hub
    const compLabGroup = new THREE.Group();
    compLabGroup.position.set(-22, 0, -32);

    const compBody = new THREE.Mesh(new THREE.BoxGeometry(15, 7.5, 12), new THREE.MeshStandardMaterial({ map: wallTex }));
    compBody.position.y = 3.75;
    compBody.castShadow = true;
    compLabGroup.add(compBody);

    const compRoof = new THREE.Mesh(new THREE.ConeGeometry(12, 3.0, 4), new THREE.MeshStandardMaterial({ map: getRoofTileTexture() }));
    compRoof.scale.set(1.2, 1, 0.9);
    compRoof.position.set(0, 9.0, 0);
    compRoof.rotation.y = Math.PI / 4;
    compLabGroup.add(compRoof);

    const ledScreen = new THREE.Mesh(new THREE.BoxGeometry(5, 1.8, 0.1), new THREE.MeshStandardMaterial({ color: '#0284C7', emissive: '#0369A1', emissiveIntensity: 0.5 }));
    ledScreen.position.set(0, 5.2, 6.06);
    compLabGroup.add(ledScreen);

    this.scene.add(compLabGroup);
    this.buildingGroups.set('computer-lab', compLabGroup);
  }

  private buildSportsComplex() {
    // 1. Multipurpose Gymnasium (Large curved hall)
    const gymGroup = new THREE.Group();
    gymGroup.position.set(34, 0, -32);

    const gymMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.4 });
    const gymBody = new THREE.Mesh(new THREE.BoxGeometry(18, 8.5, 22), gymMat);
    gymBody.position.y = 4.25;
    gymBody.castShadow = true;
    gymGroup.add(gymBody);

    // Barrel vaulted roof
    const archRoofGeo = new THREE.CylinderGeometry(10, 10, 22, 24, 1, false, 0, Math.PI);
    const archRoofMat = new THREE.MeshStandardMaterial({ color: '#1E3A8A', roughness: 0.3, metalness: 0.3 });
    const archRoof = new THREE.Mesh(archRoofGeo, archRoofMat);
    archRoof.position.set(0, 8.5, 0);
    archRoof.rotation.z = Math.PI / 2;
    archRoof.castShadow = true;
    gymGroup.add(archRoof);

    this.scene.add(gymGroup);
    this.buildingGroups.set('gymnasium', gymGroup);

    // 2. Synthetic Turf Mini-Football Pitch
    const footballGroup = new THREE.Group();
    footballGroup.position.set(16, 0, -56);

    const turfMesh = new THREE.Mesh(new THREE.PlaneGeometry(28, 18), new THREE.MeshStandardMaterial({ map: getFootballTurfTexture() }));
    turfMesh.rotation.x = -Math.PI / 2;
    turfMesh.position.set(0, 0.02, 0);
    turfMesh.receiveShadow = true;
    footballGroup.add(turfMesh);

    // 3D Goals for football pitch
    const goalMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', metalness: 0.8, roughness: 0.2 });
    const createGoal = (gx: number, gz: number, rotY: number) => {
      const g = new THREE.Group();
      g.position.set(gx, 0, gz);
      g.rotation.y = rotY;

      const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2), goalMat);
      post1.position.set(-2, 1.1, 0);
      g.add(post1);

      const post2 = post1.clone();
      post2.position.set(2, 1.1, 0);
      g.add(post2);

      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.1), goalMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 2.2, 0);
      g.add(bar);

      footballGroup.add(g);
    };
    createGoal(-14, 0, Math.PI / 2);
    createGoal(14, 0, -Math.PI / 2);

    this.scene.add(footballGroup);
    this.buildingGroups.set('football-field', footballGroup);

    // 3. Outdoor Basketball / Volleyball Court
    const courtGroup = new THREE.Group();
    courtGroup.position.set(-16, 0, -56);

    const bballMesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 16), new THREE.MeshStandardMaterial({ map: getBasketballCourtTexture() }));
    bballMesh.rotation.x = -Math.PI / 2;
    bballMesh.position.set(0, 0.02, 0);
    bballMesh.receiveShadow = true;
    courtGroup.add(bballMesh);

    // Basketball hoops
    const createHoop = (hx: number, hz: number, rotY: number) => {
      const hoopGroup = new THREE.Group();
      hoopGroup.position.set(hx, 0, hz);
      hoopGroup.rotation.y = rotY;

      // Post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8), new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.8 }));
      post.position.set(0, 1.9, 0.8);
      hoopGroup.add(post);

      // Backboard
      const bb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.2 }));
      bb.position.set(0, 3.3, 0);
      hoopGroup.add(bb);

      // Orange Rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: '#EA580C', roughness: 0.3 }));
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0, 3.05, -0.32);
      hoopGroup.add(rim);

      courtGroup.add(hoopGroup);
    };
    createHoop(0, -7.5, 0);
    createHoop(0, 7.5, Math.PI);

    this.scene.add(courtGroup);
    this.buildingGroups.set('volleyball-court', courtGroup);
  }

  private buildCanteenAndServices() {
    const wallTex = getSchoolWallTexture();

    // 1. Canteen (Food Court)
    const canteenGroup = new THREE.Group();
    canteenGroup.position.set(-36, 0, -2);
    canteenGroup.rotation.y = Math.PI / 2;

    const canteenBody = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 20), new THREE.MeshStandardMaterial({ map: wallTex }));
    canteenBody.position.y = 2.5;
    canteenBody.castShadow = true;
    canteenGroup.add(canteenBody);

    // Outdoor dining tables with umbrellas
    const tableMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.5 });
    const parasolColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

    for (let i = 0; i < 4; i++) {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(9, 0, -6 + i * 4);

      const table = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 12), tableMat);
      table.position.y = 0.4;
      table.castShadow = true;
      tableGroup.add(table);

      // Umbrella parasol
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), new THREE.MeshStandardMaterial({ color: '#475569' }));
      pole.position.y = 1.25;
      tableGroup.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.7, 8), new THREE.MeshStandardMaterial({ color: parasolColors[i], roughness: 0.4 }));
      umbrella.position.y = 2.3;
      tableGroup.add(umbrella);

      canteenGroup.add(tableGroup);
    }

    this.scene.add(canteenGroup);
    this.buildingGroups.set('canteen', canteenGroup);

    // 2. Medical Clinic (Phòng Y tế)
    const clinicGroup = new THREE.Group();
    clinicGroup.position.set(-36, 0, 16);
    clinicGroup.rotation.y = Math.PI / 2;

    const clinic = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 12), new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.6 }));
    clinic.position.y = 2.5;
    clinic.castShadow = true;
    clinicGroup.add(clinic);

    // Red Cross emblem
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: '#DC2626' }));
    crossH.position.set(4.1, 3.2, 0);
    crossH.rotation.y = Math.PI / 2;
    clinicGroup.add(crossH);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.05), new THREE.MeshStandardMaterial({ color: '#DC2626' }));
    crossV.position.set(4.1, 3.2, 0);
    crossV.rotation.y = Math.PI / 2;
    clinicGroup.add(crossV);

    this.scene.add(clinicGroup);
    this.buildingGroups.set('health-clinic', clinicGroup);
  }

  private buildAdminAndTeachersLounge() {
    const wallTex = getSchoolWallTexture();
    const roofTex = getRoofTileTexture();

    // 1. Administration & Principal Board (Khối Hiệu bộ)
    const adminGroup = new THREE.Group();
    adminGroup.position.set(36, 0, -2);
    adminGroup.rotation.y = -Math.PI / 2;

    const adminBody = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 16), new THREE.MeshStandardMaterial({ map: wallTex }));
    adminBody.position.y = 3;
    adminBody.castShadow = true;
    adminGroup.add(adminBody);

    const adminRoof = new THREE.Mesh(new THREE.ConeGeometry(9, 2.8, 4), new THREE.MeshStandardMaterial({ map: roofTex }));
    adminRoof.scale.set(1.2, 1, 1.6);
    adminRoof.position.set(0, 7.4, 0);
    adminRoof.rotation.y = Math.PI / 4;
    adminGroup.add(adminRoof);

    this.scene.add(adminGroup);
    this.buildingGroups.set('administration', adminGroup);

    // 2. Teachers Room & Faculty Lounge (Phòng Giáo viên)
    const teacherGroup = new THREE.Group();
    teacherGroup.position.set(36, 0, 16);
    teacherGroup.rotation.y = -Math.PI / 2;

    const teacherBody = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 18), new THREE.MeshStandardMaterial({ map: wallTex }));
    teacherBody.position.y = 2.5;
    teacherBody.castShadow = true;
    teacherGroup.add(teacherBody);

    this.scene.add(teacherGroup);
    this.buildingGroups.set('teachers-room', teacherGroup);
  }

  private buildCampusTreesAndBenches() {
    const poincianaRed = new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.7 });
    const poincianaLeaf = new THREE.MeshStandardMaterial({ color: '#16A34A', roughness: 0.8 });
    const bàngLeaf = new THREE.MeshStandardMaterial({ color: '#15803D', roughness: 0.85 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5B3A29', roughness: 0.9 });
    const benchMat = new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.5 });

    // Procedural Tree Creator (Phượng Vĩ with red blooms or Bàng with broad green canopies)
    const createTree = (tx: number, tz: number, isPoinciana: boolean, scale: number = 1) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      // Trunk with organic slant
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.6 * scale, 4.2 * scale, 8), trunkMat);
      trunk.position.y = 2.1 * scale;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      trunk.castShadow = true;
      tree.add(trunk);

      // Canopy layers
      const numLayers = isPoinciana ? 3 : 2;
      for (let l = 0; l < numLayers; l++) {
        const radius = (3.5 - l * 0.6) * scale;
        const leafMat = isPoinciana ? (l === 2 ? poincianaRed : poincianaLeaf) : bàngLeaf;
        const canopy = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 8), leafMat);
        canopy.position.set(0, (3.8 + l * 1.5) * scale, 0);
        canopy.scale.set(1.4, 0.7, 1.4);
        canopy.castShadow = true;
        tree.add(canopy);
      }

      this.scene.add(tree);
    };

    // Tree coordinates around courtyard, perimeter, and pathways
    const treePositions = [
      // Courtyard avenue
      [-12, 28, true],
      [12, 28, true],
      [-12, 20, false],
      [12, 20, false],
      [-12, 4, true],
      [12, 4, true],
      [-12, -12, false],
      [12, -12, false],
      // Backyard and sports area
      [-26, -42, true],
      [26, -42, true],
      [0, -48, false],
      [-30, -56, false],
      [32, -56, true],
    ];

    treePositions.forEach(([x, z, isP]) => {
      createTree(x as number, z as number, isP as boolean, 1 + (Math.random() - 0.5) * 0.2);

      // Stone bench under some trees
      if (Math.random() > 0.4) {
        const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.7), benchMat);
        bench.position.set((x as number) + 1.8, 0.25, (z as number) + 1.2);
        bench.rotation.y = Math.random() * Math.PI;
        bench.castShadow = true;
        this.scene.add(bench);
      }
    });
  }

  private buildPlayerCharacter() {
    this.playerGroup.position.copy(this.playerPos);

    // Procedural Vietnamese Student Character (Áo trắng - Quần xanh navy - Cặp sách)
    const skinMat = new THREE.MeshStandardMaterial({ color: '#FED7AA', roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 }); // Áo sơ mi trắng
    const pantsMat = new THREE.MeshStandardMaterial({ color: '#1E3A8A', roughness: 0.7 }); // Quần tây xanh đen
    const shoeMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.4 });
    const bagMat = new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.7 }); // Cặp đỏ nổi bật

    // Torso (Áo trắng)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.0, 0.4), shirtMat);
    torso.position.y = 1.35;
    torso.castShadow = true;
    this.playerGroup.add(torso);

    // Student Red Scarf / Collar (Khăn quàng đỏ / Cà vạt học sinh)
    const scarf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 3), new THREE.MeshStandardMaterial({ color: '#EF4444' }));
    scarf.position.set(0, 1.6, 0.22);
    scarf.rotation.z = Math.PI;
    this.playerGroup.add(scarf);

    // Backpack (Cặp học sinh)
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.25), bagMat);
    bag.position.set(0, 1.35, -0.3);
    bag.castShadow = true;
    this.playerGroup.add(bag);

    // Head & Hair
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
    head.position.y = 2.05;
    head.castShadow = true;
    this.playerGroup.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), hairMat);
    hair.position.set(0, 2.15, -0.05);
    hair.scale.set(1.02, 0.8, 1.05);
    this.playerGroup.add(hair);

    // Arms
    this.leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), shirtMat);
    this.leftArm.position.set(-0.48, 1.3, 0);
    this.leftArm.castShadow = true;
    this.playerGroup.add(this.leftArm);

    this.rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), shirtMat);
    this.rightArm.position.set(0.48, 1.3, 0);
    this.rightArm.castShadow = true;
    this.playerGroup.add(this.rightArm);

    // Legs
    this.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), pantsMat);
    this.leftLeg.position.set(-0.22, 0.5, 0);
    this.leftLeg.castShadow = true;
    this.playerGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), pantsMat);
    this.rightLeg.position.set(0.22, 0.5, 0);
    this.rightLeg.castShadow = true;
    this.playerGroup.add(this.rightLeg);

    // Shoes
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.4), shoeMat);
    lShoe.position.set(-0.22, 0.08, 0.08);
    this.playerGroup.add(lShoe);

    const rShoe = lShoe.clone();
    rShoe.position.set(0.22, 0.08, 0.08);
    this.playerGroup.add(rShoe);

    this.scene.add(this.playerGroup);
  }

  private buildLocationMarkers() {
    CAMPUS_LOCATIONS.forEach((loc) => {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(loc.position[0], 2.8, loc.position[2]);

      // Floating diamond beacon
      const beaconMat = new THREE.MeshStandardMaterial({
        color: loc.category === 'sports' ? '#F97316' : loc.category === 'facility' ? '#10B981' : '#3B82F6',
        roughness: 0.2,
        metalness: 0.8,
        emissive: loc.category === 'sports' ? '#7C2D12' : '#064E3B',
        emissiveIntensity: 0.3,
      });

      const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), beaconMat);
      beacon.castShadow = true;
      markerGroup.add(beacon);

      // Light beam below beacon
      const beamMat = new THREE.MeshBasicMaterial({
        color: beaconMat.color,
        transparent: true,
        opacity: 0.35,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.4, 2.5, 8), beamMat);
      beam.position.y = -1.25;
      markerGroup.add(beam);

      this.locationMarkers.push({
        id: loc.id,
        group: markerGroup,
        basePos: new THREE.Vector3(loc.position[0], 2.8, loc.position[2]),
      });

      this.scene.add(markerGroup);
    });
  }

  public updateLocationPositions(locations: CampusLocation[]) {
    locations.forEach((loc) => {
      const group = this.buildingGroups.get(loc.id);
      if (group) {
        group.position.x = loc.position[0];
        group.position.z = loc.position[2];
        if (loc.rotation !== undefined) {
          group.rotation.y = loc.rotation;
        }
      }

      const marker = this.locationMarkers.find((m) => m.id === loc.id);
      if (marker) {
        marker.basePos.set(loc.position[0], 2.8, loc.position[2]);
        marker.group.position.x = loc.position[0];
        marker.group.position.z = loc.position[2];
      }
    });
  }

  // --- Interaction & Shooting Action ---

  public shootBasketball() {
    soundManager.playBasketballSwish();

    const ballMat = new THREE.MeshStandardMaterial({ color: '#EA580C', roughness: 0.4 });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), ballMat);
    ball.castShadow = true;

    // Start at player hand position
    ball.position.copy(this.playerPos).add(new THREE.Vector3(0, 1.8, 0));

    // Vector towards hoop
    const target = this.hoopPos.clone();
    const dir = target.sub(ball.position);
    const dist = Math.min(dir.length(), 25);
    dir.normalize();

    // Trajectory velocity with upward arc
    const vel = dir.clone().multiplyScalar(dist * 1.3);
    vel.y = 8.5;

    this.scene.add(ball);
    this.basketballs.push({ mesh: ball, vel, active: true });

    // Check if close enough to hoop to trigger score
    if (this.playerPos.distanceTo(this.hoopPos) < 18) {
      setTimeout(() => {
        if (this.onScoreBasket) this.onScoreBasket();
      }, 700);
    }
  }

  public kickSoccerBall() {
    soundManager.playSoccerKick();

    const ballMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.3 });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), ballMat);
    ball.castShadow = true;

    // Start at player foot position
    ball.position.copy(this.playerPos).add(new THREE.Vector3(0, 0.4, 0));

    // Vector towards soccer goal
    const target = this.soccerGoalPos.clone();
    const dir = target.sub(ball.position);
    const dist = Math.min(dir.length(), 35);
    dir.normalize();

    // Trajectory velocity with upward arc
    const vel = dir.clone().multiplyScalar(dist * 1.4);
    vel.y = 5.2;

    this.scene.add(ball);
    this.basketballs.push({ mesh: ball, vel, active: true });

    // Check if close enough to football goal to trigger score
    if (this.playerPos.distanceTo(this.soccerGoalPos) < 32) {
      setTimeout(() => {
        soundManager.playGoalCheer();
        if (this.onScoreGoal) this.onScoreGoal();
      }, 650);
    }
  }

  public teleportToLocation(locId: string) {
    const loc = CAMPUS_LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;

    if (locId === 'gate') {
      this.playerPos.set(0, 0, 53);
    } else {
      this.playerPos.set(loc.position[0], 0, loc.position[2] + 4);
    }
    this.playerVel.set(0, 0, 0);
    this.cameraYaw = 0;
    this.playerRotY = Math.PI;
    soundManager.playDiscovery();
  }

  // --- Main 60fps Loop ---

  private startLoop() {
    const tick = () => {
      const rawDt = this.clock.getDelta();
      const dt = Math.min(rawDt, 0.05); // Clamp dt to prevent tunneling

      this.updatePhysicsAndPlayer(dt);
      this.updateFlagWave();
      this.updateMarkers();
      this.updateBasketballs(dt);
      this.updateCamera();

      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  private updatePhysicsAndPlayer(dt: number) {
    let moveFwd = 0;
    let moveSide = 0;

    if (this.controls.forward) moveFwd += 1;
    if (this.controls.backward) moveFwd -= 1;
    if (this.controls.left) moveSide -= 1;
    if (this.controls.right) moveSide += 1;

    const isMoving = moveFwd !== 0 || moveSide !== 0;

    if (isMoving) {
      const speed = this.controls.sprint ? 9.5 : 5.2;

      // In camera view with camera at (player.x + sin(yaw)*dist, ..., player.z + cos(yaw)*dist):
      // The view forward direction (from camera towards player, into the world) is:
      // forwardVec = (-sin(cameraYaw), 0, -cos(cameraYaw))
      // When cameraYaw = 0: forwardVec = (0, 0, -1) [pointing into the schoolyard from gate]
      const forwardVec = _v1.set(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
      const rightVec = _v2.set(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

      const moveDir = forwardVec.multiplyScalar(moveFwd).add(rightVec.multiplyScalar(moveSide)).normalize();

      this.playerPos.x += moveDir.x * speed * dt;
      this.playerPos.z += moveDir.z * speed * dt;

      // Rotate player towards movement direction
      this.playerRotY = Math.atan2(moveDir.x, moveDir.z);

      // Walk cycle animation
      this.walkCycle += dt * (this.controls.sprint ? 14 : 9);
      if (this.leftLeg && this.rightLeg && this.leftArm && this.rightArm) {
        this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.7;
        this.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.7;
        this.leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.6;
        this.rightArm.rotation.x = Math.sin(this.walkCycle) * 0.6;
      }

      // Footstep sound trigger periodically
      if (Math.sin(this.walkCycle) > 0.95) {
        soundManager.playFootstep();
      }
    } else {
      // Idle pose reset
      if (this.leftLeg && this.rightLeg && this.leftArm && this.rightArm) {
        this.leftLeg.rotation.x = THREE.MathUtils.damp(this.leftLeg.rotation.x, 0, 8, dt);
        this.rightLeg.rotation.x = THREE.MathUtils.damp(this.rightLeg.rotation.x, 0, 8, dt);
        this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 8, dt);
        this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 8, dt);
      }
    }

    // Jump Physics
    if (this.controls.jump && this.isGrounded) {
      this.playerVel.y = 7.0;
      this.isGrounded = false;
      soundManager.playJump();
    }

    if (!this.isGrounded) {
      this.playerVel.y -= 22 * dt; // Gravity
      this.playerPos.y += this.playerVel.y * dt;

      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.playerVel.y = 0;
        this.isGrounded = true;
      }
    }

    // World boundary clamping (within campus grounds, extending to outside gate)
    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -52, 52);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -72, 58);

    // Apply to group
    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotY;

    // Check proximity to locations
    let closestId: string | null = null;
    let minDist = 7.5; // Trigger radius

    for (const loc of CAMPUS_LOCATIONS) {
      const dist = this.playerPos.distanceTo(_v1.set(loc.position[0], 0, loc.position[2]));
      if (dist < minDist) {
        minDist = dist;
        closestId = loc.id;
      }
    }

    if (closestId !== this.nearbyLocationId) {
      this.nearbyLocationId = closestId;
      if (this.onNearbyLocationChange) {
        this.onNearbyLocationChange(closestId);
      }
    }
  }

  private updateFlagWave() {
    if (!this.flagMesh) return;
    const time = this.clock.getElapsedTime() * 4;
    const posAttr = this.flagMesh.geometry.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const wave = Math.sin(u * 2.5 + time) * 0.28 * (u / 3.4);
      posAttr.setZ(i, wave);
    }
    posAttr.needsUpdate = true;
  }

  private updateMarkers() {
    const time = this.clock.getElapsedTime();
    this.locationMarkers.forEach((m) => {
      m.group.position.y = m.basePos.y + Math.sin(time * 2.5 + m.basePos.x) * 0.35;
      m.group.rotation.y = time * 1.5;
    });
  }

  private updateBasketballs(dt: number) {
    for (let i = this.basketballs.length - 1; i >= 0; i--) {
      const b = this.basketballs[i];
      if (!b.active) continue;

      b.vel.y -= 18 * dt; // Gravity
      b.mesh.position.addScaledVector(b.vel, dt);

      // Floor bounce
      if (b.mesh.position.y <= 0.35) {
        b.mesh.position.y = 0.35;
        b.vel.y = -b.vel.y * 0.65;
        b.vel.x *= 0.7;
        b.vel.z *= 0.7;

        if (Math.abs(b.vel.y) < 1) {
          b.active = false;
          setTimeout(() => {
            this.scene.remove(b.mesh);
            b.mesh.geometry.dispose();
          }, 2000);
        }
      }
    }
  }

  private updateCamera() {
    if (this.cameraMode === 'third_person') {
      const targetLook = _v1.copy(this.playerPos).add(new THREE.Vector3(0, 1.8, 0));

      const cx = this.playerPos.x + Math.sin(this.cameraYaw) * this.cameraDist;
      const cy = this.playerPos.y + Math.sin(this.cameraPitch) * this.cameraDist + 2.2;
      const cz = this.playerPos.z + Math.cos(this.cameraYaw) * this.cameraDist;

      _vCam.set(cx, cy, cz);
      this.camera.position.lerp(_vCam, 0.12);
      this.camera.lookAt(targetLook);
    } else if (this.cameraMode === 'drone') {
      // Slow majestic orbit around campus
      const t = this.clock.getElapsedTime() * 0.12;
      this.camera.position.set(Math.sin(t) * 55, 32, Math.cos(t) * 55);
      this.camera.lookAt(0, 4, 0);
    } else if (this.cameraMode === 'photo') {
      // First person photo viewfinder
      const headPos = _v1.copy(this.playerPos).add(new THREE.Vector3(0, 1.9, 0));
      this.camera.position.copy(headPos);

      const lookTarget = headPos.clone().add(
        new THREE.Vector3(
          -Math.sin(this.cameraYaw) * 10,
          Math.sin(this.cameraPitch) * 10,
          -Math.cos(this.cameraYaw) * 10
        )
      );
      this.camera.lookAt(lookTarget);
    }
  }

  // --- Snapshot Camera Rendering for Photo Mode ---
  public captureSnapshot(): string {
    soundManager.playShutter();
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  public getPlayerPosition() {
    return this.playerPos;
  }

  private onResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
