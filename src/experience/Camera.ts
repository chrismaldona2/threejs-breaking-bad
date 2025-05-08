import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  private readonly experience = Experience.getInstance();
  private readonly gui = this.experience.debug.gui;

  private sizes = this.experience.sizes;

  private boundsMin!: THREE.Vector3;
  private boundsMax!: THREE.Vector3;

  private perspectiveCamera!: THREE.PerspectiveCamera;
  private orthographicCamera!: THREE.OrthographicCamera;
  private orthographicCameraFrustumSize = 0.75;

  instance!: THREE.Camera;
  orbitControls!: OrbitControls;

  constructor() {
    this.perspectiveCamera = this.createPerspectiveCamera();
    this.orthographicCamera = this.createOrthographicCamera();

    this.instance = this.perspectiveCamera;
    this.setupBounds();
    this.initOrbitControls(this.instance);
  }

  private setupBounds() {
    if (this.instance instanceof THREE.PerspectiveCamera) {
      this.boundsMin = new THREE.Vector3(-0.32, 0, -0.1);
      this.boundsMax = new THREE.Vector3(2, 5, 3);
    } else {
      this.boundsMin = new THREE.Vector3(0, 0, 0.1);
      this.boundsMax = new THREE.Vector3(2, 10, 1.75);
    }
  }

  private createPerspectiveCamera() {
    const aspect = this.sizes.width / this.sizes.height;

    const cam = new THREE.PerspectiveCamera(45, aspect, 0.01, 100);
    cam.position.set(0.5, 0.54, 0.73);
    return cam;
  }

  private createOrthographicCamera() {
    const aspect = this.sizes.width / this.sizes.height;

    const cam = new THREE.OrthographicCamera(
      (-this.orthographicCameraFrustumSize * aspect) / 2,
      (this.orthographicCameraFrustumSize * aspect) / 2,
      this.orthographicCameraFrustumSize / 2,
      -this.orthographicCameraFrustumSize / 2,
      0.1,
      100
    );
    cam.position.set(0.5, 0.9, 0.73);

    return cam;
  }

  private initOrbitControls(camera: THREE.Camera) {
    if (this.orbitControls) this.orbitControls.dispose();

    this.orbitControls = new OrbitControls(
      camera,
      this.experience.canvas.domElement
    );

    if (this.instance instanceof THREE.PerspectiveCamera) {
      this.orbitControls.target.set(-0.05, 0, 0);
    } else if (this.instance instanceof THREE.OrthographicCamera) {
      this.orbitControls.target.set(-0.05, 0.175, 0);
    }

    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.panSpeed = 0.5;

    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxDistance = 3;

    this.orbitControls.minZoom = 0.4;
    this.orbitControls.maxZoom = 6;

    this.orbitControls.maxPolarAngle = Math.PI / 2.1;
    this.orbitControls.zoomSpeed = 0.5;
  }

  private handleBounds() {
    this.instance.position.clamp(this.boundsMin, this.boundsMax);
    this.orbitControls.target.clamp(this.boundsMin, this.boundsMax);
  }

  setupTweaks() {
    const debugObj = {
      switchCamera: () => {
        this.instance =
          this.instance === this.perspectiveCamera
            ? this.orthographicCamera
            : this.perspectiveCamera;
        this.resize();
        this.setupBounds();
        this.initOrbitControls(this.instance);
        this.experience.listener.setupCameraListener();
      },
    };

    this.gui.add(debugObj, "switchCamera").name("Switch Camera");
  }

  resize() {
    const { width, height } = this.sizes;
    const aspect = width / height;

    if (this.instance instanceof THREE.PerspectiveCamera) {
      this.instance.aspect = aspect;
      this.instance.updateProjectionMatrix();
    } else if (this.instance instanceof THREE.OrthographicCamera) {
      this.instance.left = (-this.orthographicCameraFrustumSize * aspect) / 2;
      this.instance.right = (this.orthographicCameraFrustumSize * aspect) / 2;
      this.instance.top = this.orthographicCameraFrustumSize / 2;
      this.instance.bottom = -this.orthographicCameraFrustumSize / 2;
      this.instance.updateProjectionMatrix();
    }
  }

  update() {
    this.orbitControls.update();
    this.handleBounds();
  }

  dispose() {
    this.orbitControls.dispose();
  }
}

export default Camera;
