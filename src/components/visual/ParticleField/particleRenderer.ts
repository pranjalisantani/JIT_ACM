/**
 * ACM FACE — Particle Renderer
 * Custom ShaderMaterial for luminous points with sharp core + soft halo sprite and per-particle depth sizing.
 */

import * as THREE from "three";
import { Particle, AmbientParticle } from "./particleSimulation";

export class ParticleRenderer {
  public mainPoints: THREE.Points;
  public ambientPoints: THREE.Points;

  private mainGeometry: THREE.BufferGeometry;
  private ambientGeometry: THREE.BufferGeometry;

  private mainPositions: Float32Array;
  private mainColors: Float32Array;
  private mainSizes: Float32Array;
  private mainAlphas: Float32Array;

  private ambientPositions: Float32Array;
  private ambientColors: Float32Array;

  private spriteTexture: THREE.CanvasTexture;
  private mainMaterial: THREE.ShaderMaterial;
  private ambientMaterial: THREE.PointsMaterial;

  constructor(particles: Particle[], ambientParticles: AmbientParticle[]) {
    this.spriteTexture = this.createParticleSprite();

    // 1. Main Particles Geometry & Attributes
    const pCount = particles.length;
    this.mainPositions = new Float32Array(pCount * 3);
    this.mainColors = new Float32Array(pCount * 3);
    this.mainSizes = new Float32Array(pCount);
    this.mainAlphas = new Float32Array(pCount);

    this.mainGeometry = new THREE.BufferGeometry();
    this.mainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.mainPositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.mainGeometry.setAttribute(
      "aColor",
      new THREE.BufferAttribute(this.mainColors, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.mainGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(this.mainSizes, 1).setUsage(THREE.DynamicDrawUsage)
    );
    this.mainGeometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(this.mainAlphas, 1).setUsage(THREE.DynamicDrawUsage)
    );

    // Custom Shader for Exact Depth Attenuation & Luminous Halos
    this.mainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: this.spriteTexture },
        uPixelRatio: { value: Math.min(2.0, typeof window !== "undefined" ? window.devicePixelRatio : 1.0) },
      },
      vertexShader: `
        uniform float uPixelRatio;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aAlpha;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;
          vAlpha = aAlpha;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Clear, visible particle dots with realistic perspective attenuation
          gl_PointSize = aSize * uPixelRatio * (60.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          if (texColor.a < 0.01) discard;

          // Luminous Core + Halo falloff
          gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mainPoints = new THREE.Points(this.mainGeometry, this.mainMaterial);
    this.mainPoints.frustumCulled = false;

    // 2. Ambient Deep Starfield Geometry & Points
    const ambCount = ambientParticles.length;
    this.ambientPositions = new Float32Array(ambCount * 3);
    this.ambientColors = new Float32Array(ambCount * 3);

    for (let j = 0; j < ambCount; j++) {
      const a = ambientParticles[j];
      this.ambientPositions[j * 3] = a.x;
      this.ambientPositions[j * 3 + 1] = a.y;
      this.ambientPositions[j * 3 + 2] = a.z;

      this.ambientColors[j * 3] = a.alpha;
      this.ambientColors[j * 3 + 1] = a.alpha;
      this.ambientColors[j * 3 + 2] = a.alpha;
    }

    this.ambientGeometry = new THREE.BufferGeometry();
    this.ambientGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.ambientPositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.ambientGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.ambientColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    this.ambientMaterial = new THREE.PointsMaterial({
      size: 1.8,
      map: this.spriteTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.ambientPoints = new THREE.Points(this.ambientGeometry, this.ambientMaterial);
    this.ambientPoints.frustumCulled = false;
  }

  /**
   * Generates a 64x64 radial gradient texture with intense crisp white core and soft luminous halo.
   */
  private createParticleSprite(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const center = 32;
      const radius = 30;
      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);

      // Solid Crisp White Core + Soft Dispersion Aura
      grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.24, "rgba(255, 255, 255, 0.92)");
      grad.addColorStop(0.48, "rgba(220, 238, 255, 0.48)");
      grad.addColorStop(0.75, "rgba(160, 200, 255, 0.16)");
      grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  public setPixelRatio(dpr: number): void {
    if (this.mainMaterial.uniforms.uPixelRatio) {
      this.mainMaterial.uniforms.uPixelRatio.value = dpr;
    }
  }

  /**
   * Per-frame attribute refresh for main particles and ambient particles
   */
  public update(
    particles: Particle[],
    ambientParticles: AmbientParticle[],
    sectionState: string = "hero"
  ): void {
    const pCount = particles.length;

    for (let i = 0; i < pCount; i++) {
      const p = particles[i];
      const i3 = i * 3;

      // Position
      this.mainPositions[i3] = p.currX;
      this.mainPositions[i3 + 1] = p.currY;
      this.mainPositions[i3 + 2] = p.currZ;

      // White and Restrained Cool-Blue Tones according to depth band
      if (p.depthBand === "near") {
        // Pure Luminous White Core
        this.mainColors[i3] = 1.0;
        this.mainColors[i3 + 1] = 1.0;
        this.mainColors[i3 + 2] = 1.0;
      } else if (p.depthBand === "mid") {
        // Silver / Cool Ice Tint
        this.mainColors[i3] = 0.92;
        this.mainColors[i3 + 1] = 0.96;
        this.mainColors[i3 + 2] = 1.0;
      } else {
        // Deep Cool Slate
        this.mainColors[i3] = 0.72;
        this.mainColors[i3 + 1] = 0.82;
        this.mainColors[i3 + 2] = 0.95;
      }

      this.mainSizes[i] = p.currentSize;
      this.mainAlphas[i] = p.currentAlpha;
    }

    (this.mainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.mainGeometry.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
    (this.mainGeometry.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (this.mainGeometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;

    // Ambient stars with contextual section suppression
    const ambCount = ambientParticles.length;
    const sectionAmbientMult =
      sectionState === "closing"
        ? 0.35
        : sectionState === "footer"
        ? 0.25
        : sectionState === "projects" || sectionState === "team"
        ? 0.55
        : 1.0;

    for (let j = 0; j < ambCount; j++) {
      const a = ambientParticles[j];
      const j3 = j * 3;
      this.ambientPositions[j3] = a.x;
      this.ambientPositions[j3 + 1] = a.y;
      this.ambientPositions[j3 + 2] = a.z;

      const alpha = a.alpha * a.revealAlpha * sectionAmbientMult;
      this.ambientColors[j3] = alpha;
      this.ambientColors[j3 + 1] = alpha;
      this.ambientColors[j3 + 2] = alpha;
    }

    (this.ambientGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.ambientGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  public dispose(): void {
    this.mainGeometry.dispose();
    this.ambientGeometry.dispose();
    this.mainMaterial.dispose();
    this.ambientMaterial.dispose();
    this.spriteTexture.dispose();
  }
}
