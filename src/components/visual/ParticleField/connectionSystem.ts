/**
 * ACM FACE — 3D Connection System
 * Dynamic spatial-neighbor connection graph rendered via THREE.LineSegments with depth and distance fading.
 */

import * as THREE from "three";
import { Particle } from "./particleSimulation";
import { PARTICLE_FIELD_CONFIG } from "./config";

interface ConnectionEdge {
  idxA: number;
  idxB: number;
  distSq: number;
  weight: number;
}

export class ConnectionSystem {
  public linesMesh: THREE.LineSegments;
  private geometry: THREE.BufferGeometry;
  private positions: Float32Array;
  private colors: Float32Array;
  private maxConnections: number;
  private maxPerParticle: number;
  private distThresholdSq: number;
  private activeEdges: ConnectionEdge[] = [];
  private frameCounter: number = 0;
  private topologyUpdateInterval: number = 8; // Recalculate graph neighbors every 8 frames

  constructor(isMobile: boolean = false) {
    const config = isMobile
      ? PARTICLE_FIELD_CONFIG.mobile
      : PARTICLE_FIELD_CONFIG.desktop;

    this.maxConnections = config.maxTotalConnections;
    this.maxPerParticle = config.maxConnectionsPerParticle;
    const threshold = config.connectionDistanceThreshold;
    this.distThresholdSq = threshold * threshold;
    this.topologyUpdateInterval = isMobile ? 4 : 2; // Rapid 60fps graph updates

    // LineSegments requires 2 vertices per edge, 3 floats per vertex (X, Y, Z)
    this.positions = new Float32Array(this.maxConnections * 2 * 3);
    // Vertex colors: RGB per vertex (3 floats per vertex)
    this.colors = new Float32Array(this.maxConnections * 2 * 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    // Initial draw range is 0
    this.geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0, // Per-vertex alpha is simulated via grayscale RGB intensity
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.linesMesh = new THREE.LineSegments(this.geometry, material);
    this.linesMesh.frustumCulled = false;
  }

  /**
   * Recalculates candidate neighbor edges among particles in 3D space.
   * Enforces 2-4 connections max per particle to prevent spiderwebbing.
   */
  private updateTopology(particles: Particle[]): void {
    const pLen = particles.length;
    const connectionCounts = new Uint8Array(pLen);
    const candidateEdges: ConnectionEdge[] = [];

    // Prioritize mid & near particles for prominent constellation bridges
    for (let i = 0; i < pLen; i++) {
      if (connectionCounts[i] >= this.maxPerParticle) continue;
      const p1 = particles[i];

      for (let j = i + 1; j < pLen; j++) {
        if (connectionCounts[j] >= this.maxPerParticle) continue;
        const p2 = particles[j];

        const dx = p1.currX - p2.currX;
        const dy = p1.currY - p2.currY;
        const dz = p1.currZ - p2.currZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        const effectiveThresholdSq =
          this.distThresholdSq *
          p1.connectionRangeMultiplier *
          p2.connectionRangeMultiplier;

        if (distSq < effectiveThresholdSq) {
          // Weight based on depth bands (near/mid have stronger connection presence)
          const weight = (p1.currentAlpha + p2.currentAlpha) * 0.5;

          candidateEdges.push({
            idxA: i,
            idxB: j,
            distSq,
            weight,
          });

          connectionCounts[i]++;
          connectionCounts[j]++;

          if (connectionCounts[i] >= this.maxPerParticle) break;
          if (candidateEdges.length >= this.maxConnections) break;
        }
      }

      if (candidateEdges.length >= this.maxConnections) break;
    }

    this.activeEdges = candidateEdges;
  }

  /**
   * Per-frame update: refreshes 3D positions and computes distance/depth faded grayscale intensity
   */
  public update(
    particles: Particle[],
    globalAlphaMultiplier: number = 1.0,
    revealProgress: number = 1.0,
    activeRegion: string | null = null
  ): void {
    // Immediate line reveal tracking
    const connectionReveal = Math.min(1.0, Math.max(0.0, revealProgress));

    if (connectionReveal <= 0.001) {
      this.geometry.setDrawRange(0, 0);
      return;
    }

    this.frameCounter++;
    if (this.frameCounter % this.topologyUpdateInterval === 0 || this.activeEdges.length === 0) {
      this.updateTopology(particles);
    }

    const edgeCount = this.activeEdges.length;
    let posPtr = 0;
    let colPtr = 0;
    const thresholdSq = this.distThresholdSq;
    const maxStretchSq = thresholdSq * 1.25; // Elastic stretch hysteresis

    for (let e = 0; e < edgeCount; e++) {
      const edge = this.activeEdges[e];
      const p1 = particles[edge.idxA];
      const p2 = particles[edge.idxB];

      const dx = p1.currX - p2.currX;
      const dy = p1.currY - p2.currY;
      const dz = p1.currZ - p2.currZ;
      const currentDistSq = dx * dx + dy * dy + dz * dz;

      // Elastic stretch: allow existing connections to stretch up to 125% of threshold before breaking
      if (currentDistSq >= maxStretchSq) continue;
      const distNorm = Math.sqrt(currentDistSq) / Math.sqrt(maxStretchSq); // 0 to 1
      const distFade = Math.max(0, 1.0 - distNorm); // 1 at 0 distance, 0 at max stretch

      // Intensity based on depth band weights and global multiplier
      const nodeFade = (p1.currentAlpha + p2.currentAlpha) * 0.5;
      let regionBoost = 1.0;
      if (activeRegion) {
        if (p1.region === activeRegion && p2.region === activeRegion) {
          regionBoost = 1.45;
        } else if (p1.region !== activeRegion && p2.region !== activeRegion && p1.region !== "ambient") {
          regionBoost = 0.75;
        }
      }

      // Delicate, subtle connecting lines that stay subordinate to particle dots
      const baseEdgeIntensity = (0.20 + 0.80 * distFade) * nodeFade * 0.45;
      const intensity = Math.min(
        0.24,
        Math.max(
          0.0,
          baseEdgeIntensity * globalAlphaMultiplier * connectionReveal * regionBoost
        )
      );

      if (intensity < 0.02) continue;

      // Vertex 1 position
      this.positions[posPtr++] = p1.currX;
      this.positions[posPtr++] = p1.currY;
      this.positions[posPtr++] = p1.currZ;

      // Vertex 2 position
      this.positions[posPtr++] = p2.currX;
      this.positions[posPtr++] = p2.currY;
      this.positions[posPtr++] = p2.currZ;

      // Restrained Cool-Blue & White Line Treatment
      const r = intensity * 0.84;
      const g = intensity * 0.92;
      const b = intensity * 1.0;

      // Vertex 1 Cool-Blue RGB
      this.colors[colPtr++] = r;
      this.colors[colPtr++] = g;
      this.colors[colPtr++] = b;

      // Vertex 2 Cool-Blue RGB
      this.colors[colPtr++] = r;
      this.colors[colPtr++] = g;
      this.colors[colPtr++] = b;
    }

    const vertexCount = posPtr / 3;
    this.geometry.setDrawRange(0, vertexCount);

    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = this.geometry.attributes.color as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  }

  public dispose(): void {
    this.geometry.dispose();
    if (this.linesMesh.material instanceof THREE.Material) {
      this.linesMesh.material.dispose();
    }
  }
}
