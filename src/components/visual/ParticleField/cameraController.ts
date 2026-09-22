/**
 * ACM FACE — Camera & View Controller
 * Manages PerspectiveCamera, autonomous slow drift, restrained cursor parallax, and scroll-driven section targets.
 */

import * as THREE from "three";
import { PARTICLE_FIELD_CONFIG, SECTION_PRESETS } from "./config";

export interface ScrollState {
  camX: number;
  camY: number;
  camZ: number;
  rotYOffset: number;
  rotXOffset: number;
  fieldScale: number;
  fieldShiftX: number;
  fieldShiftY: number;
  connectionAlphaMult: number;
  convergenceFactor: number;
}

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public scrollState: ScrollState;

  private targetMouseX: number = 0;
  private targetMouseY: number = 0;
  private currentMouseX: number = 0;
  private currentMouseY: number = 0;

  private baseZ: number;
  private lookAtTarget: THREE.Vector3;
  private isMobile: boolean;

  constructor(width: number, height: number, isMobile: boolean = false) {
    this.isMobile = isMobile;
    const cfg = PARTICLE_FIELD_CONFIG.camera;
    this.baseZ = cfg.defaultZ;
    this.lookAtTarget = new THREE.Vector3(...cfg.lookAt);

    this.camera = new THREE.PerspectiveCamera(
      cfg.fov,
      width / Math.max(1, height),
      cfg.near,
      cfg.far
    );
    this.camera.position.set(0, 0, this.baseZ);
    this.camera.lookAt(this.lookAtTarget);

    // Initial state matching Hero
    this.scrollState = { ...SECTION_PRESETS.hero };
  }

  public updateAspect(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  public onMouseMove(normalizedX: number, normalizedY: number): void {
    if (this.isMobile) return;
    this.targetMouseX = normalizedX;
    this.targetMouseY = normalizedY;
  }

  public onMouseLeave(): void {
    this.targetMouseX = 0;
    this.targetMouseY = 0;
  }

  /**
   * Per-frame camera update combining:
   * 1. Scroll-interpolated targets (camX, camY, camZ)
   * 2. Slow Lissajous autonomous drift
   * 3. Damped cursor parallax
   */
  public update(time: number, reducedMotion: boolean): void {
    if (reducedMotion) {
      this.camera.position.set(0, 0, this.baseZ);
      this.camera.rotation.set(0, 0, 0);
      this.camera.lookAt(this.lookAtTarget);
      return;
    }

    // 1. Mouse Parallax Smoothing (Desktop only)
    if (!this.isMobile) {
      const lerp = PARTICLE_FIELD_CONFIG.cursor.lerpFactor;
      this.currentMouseX += (this.targetMouseX - this.currentMouseX) * lerp;
      this.currentMouseY += (this.targetMouseY - this.currentMouseY) * lerp;
    }

    const mouseOffsetX = this.currentMouseX * PARTICLE_FIELD_CONFIG.cursor.tiltSensitivityX * 12;
    const mouseOffsetY = -this.currentMouseY * PARTICLE_FIELD_CONFIG.cursor.tiltSensitivityY * 10;

    // 2. Autonomous Cinematic Drift (Very slow, heavy, non-repeating periods)
    const driftX = Math.sin(time * 0.14) * 0.9 + Math.cos(time * 0.08) * 0.4;
    const driftY = Math.cos(time * 0.11) * 0.6 + Math.sin(time * 0.05) * 0.3;
    const driftZ = Math.sin(time * 0.09) * 0.8;

    // 3. Combine Scroll State Target + Drift + Cursor Parallax
    const targetX = this.scrollState.camX + driftX + mouseOffsetX;
    const targetY = this.scrollState.camY + driftY + mouseOffsetY;
    const targetZ = this.scrollState.camZ + driftZ;

    // Smooth exponential decay interpolation towards target
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;

    // Camera LookAt dynamic calculation
    const currentLookAt = new THREE.Vector3(
      this.lookAtTarget.x + mouseOffsetX * 0.2,
      this.lookAtTarget.y + mouseOffsetY * 0.2,
      this.lookAtTarget.z
    );
    this.camera.lookAt(currentLookAt);

    // Apply subtle camera roll/wobble offsets
    this.camera.rotation.z = Math.sin(time * 0.06) * 0.008;
  }
}
