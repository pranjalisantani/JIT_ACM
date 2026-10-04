"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { registerScrollTrigger, gsap, type ScrollTrigger } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { PARTICLE_FIELD_CONFIG, SECTION_PRESETS } from "./config";
import { ParticleSimulation, type CursorForce } from "./particleSimulation";
import { ParticleRenderer } from "./particleRenderer";
import { ConnectionSystem } from "./connectionSystem";
import { CameraController } from "./cameraController";

export function ParticleField() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const dprCap = isMobile
      ? PARTICLE_FIELD_CONFIG.mobile.dprCap
      : PARTICLE_FIELD_CONFIG.desktop.dprCap;
    const dpr = Math.min(dprCap, window.devicePixelRatio || 1);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Common Simulation, Camera, and Connection graph
    const simulation = new ParticleSimulation(isMobile);
    const cameraController = new CameraController(width, height, isMobile);
    const connectionSystem = new ConnectionSystem(isMobile);

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let particleRenderer: ParticleRenderer | null = null;
    let worldGroup: THREE.Group | null = null;

    // Canvas 2D fallback context if WebGL is unavailable
    let ctx2d: CanvasRenderingContext2D | null = null;
    let sprite2d: HTMLCanvasElement | null = null;

    try {
      scene = new THREE.Scene();
      scene.background = null;

      renderer = new THREE.WebGLRenderer({
        canvas,
        powerPreference: "high-performance",
        antialias: false,
        alpha: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(dpr);

      particleRenderer = new ParticleRenderer(
        simulation.particles,
        simulation.ambientParticles
      );
      particleRenderer.setPixelRatio(dpr);

      worldGroup = new THREE.Group();
      worldGroup.add(particleRenderer.mainPoints);
      worldGroup.add(particleRenderer.ambientPoints);
      worldGroup.add(connectionSystem.linesMesh);

      worldGroup.position.set(0, 0, 0);
      worldGroup.scale.set(1, 1, 1);
      scene.add(worldGroup);

      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__acm_debug = {
          scene,
          renderer,
          particleRenderer,
          connectionSystem,
          simulation,
          camera: cameraController.camera,
          worldGroup,
        };
      }
    } catch {
      renderer = null;
      scene = null;
      particleRenderer = null;
      worldGroup = null;
    }

    if (!renderer) {
      // High-performance Canvas 2D 3D-Perspective Engine
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx2d = canvas.getContext("2d");

      // Pre-render radial particle sprite for smooth 60fps drawImage
      sprite2d = document.createElement("canvas");
      sprite2d.width = 64;
      sprite2d.height = 64;
      const sCtx = sprite2d.getContext("2d");
      if (sCtx) {
        const rad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
        rad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
        rad.addColorStop(0.2, "rgba(240, 240, 245, 0.9)");
        rad.addColorStop(0.45, "rgba(200, 205, 215, 0.35)");
        rad.addColorStop(0.75, "rgba(140, 145, 155, 0.1)");
        rad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
        sCtx.fillStyle = rad;
        sCtx.fillRect(0, 0, 64, 64);
      }
    }

    // Initial Reveal State — fully active immediately
    const revealObj = { progress: 1.0 };
    const revealTween = gsap.to(revealObj, {
      progress: 1.0,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // GSAP ScrollTrigger Integration for Section Awareness
    const ScrollTrigger = registerScrollTrigger();
    const stInstances: ScrollTrigger[] = [];
    let currentActiveSection: string = "hero";

    if (ScrollTrigger) {
      const sectionKeys: (keyof typeof SECTION_PRESETS)[] = [
        "hero",
        "sponsors",
        "about",
        "events",
        "gallery",
        "projects",
        "team",
        "closing",
        "footer",
      ];

      sectionKeys.forEach((key) => {
        const el = document.getElementById(key);
        if (!el) return;

        const preset = (SECTION_PRESETS as Record<string, typeof SECTION_PRESETS.hero>)[key] || SECTION_PRESETS.footer;
        const updateSection = () => {
          currentActiveSection = key;
          simulation.currentSection = currentActiveSection;
          gsap.to(cameraController.scrollState, {
            ...preset,
            duration: 0.85,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const isBottomSection = key === "footer" || key === "closing";
        const st = ScrollTrigger.create({
          trigger: el,
          start: isBottomSection ? "top 90%" : "top center",
          end: isBottomSection ? "max" : "bottom center",
          onEnter: updateSection,
          onEnterBack: updateSection,
          onLeave: isBottomSection ? updateSection : undefined,
          onToggle: (self) => {
            if (self.isActive) updateSection();
          },
        });
        stInstances.push(st);
      });
    }

    // Interactive 3D Cursor Force Field Tracking
    let isCursorActive = false;
    let hasFirstCursorMove = false;
    let rawMouseX = 0;
    let rawMouseY = 0;
    const prevLocalCursor = new THREE.Vector3();
    let cursorVelocityX = 0;
    let cursorVelocityY = 0;
    const raycaster = new THREE.Raycaster();
    const worldPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeHitPoint = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      isCursorActive = true;
      rawMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      rawMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const normX = rawMouseX;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      cameraController.onMouseMove(normX, normY);
    };

    const handleMouseLeave = () => {
      isCursorActive = false;
      hasFirstCursorMove = false;
      cameraController.onMouseLeave();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isCursorActive = true;
        const touch = e.touches[0];
        rawMouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        rawMouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
        cameraController.onMouseMove(rawMouseX, (touch.clientY / window.innerHeight) * 2 - 1);
      }
    };

    const handleTouchEnd = () => {
      isCursorActive = false;
      hasFirstCursorMove = false;
      cameraController.onMouseLeave();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      cameraController.updateAspect(width, height);
      const newDpr = Math.min(dprCap, window.devicePixelRatio || 1);

      if (renderer) {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(newDpr);
        particleRenderer?.setPixelRatio(newDpr);
      } else if (canvas && ctx2d) {
        canvas.width = Math.floor(width * newDpr);
        canvas.height = Math.floor(height * newDpr);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Animation Loop with Tab Visibility Handling
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let isPageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Regional Focus Event for Interactive Sections (About Quadrumvirate)
    const handleFieldFocus = (e: Event) => {
      const customEvent = e as CustomEvent<{ region: string | null }>;
      simulation.activeRegion = customEvent.detail?.region ?? null;
    };
    window.addEventListener("acm:field-focus", handleFieldFocus);

    // Group mutable offsets for smooth lerping
    let currentFieldScale = 1.0;
    let currentShiftX = 0;
    let currentShiftY = 0;
    let currentRotYOffset = 0;
    let currentRotXOffset = 0;
    let currentConvergence = 0.0;

    const renderFrame = () => {
      animationFrameId = requestAnimationFrame(renderFrame);

      const now = performance.now();
      const deltaSec = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      if (!reducedMotion) {
        accumulatedTime += deltaSec;
      }

      const t = accumulatedTime;

      // Smoothly lerp convergence factor
      const targetState = cameraController.scrollState;
      currentConvergence += (targetState.convergenceFactor - currentConvergence) * 0.05;

      // 1. Organic Breathing Scale
      const breathScale = reducedMotion
        ? 1.0
        : 1.0 +
          PARTICLE_FIELD_CONFIG.breathing.amplitude *
            Math.sin(t * PARTICLE_FIELD_CONFIG.breathing.speed) +
          0.012 * Math.cos(t * PARTICLE_FIELD_CONFIG.breathing.speed * 0.5);

      // 2. Unproject cursor to 3D local space for physics interaction
      let cursorForce: CursorForce | null = null;
      if (isCursorActive && !reducedMotion) {
        raycaster.setFromCamera(new THREE.Vector2(rawMouseX, rawMouseY), cameraController.camera);
        if (raycaster.ray.intersectPlane(worldPlane, planeHitPoint)) {
          const localHit = planeHitPoint.clone();
          if (worldGroup) {
            worldGroup.updateMatrixWorld(true);
            worldGroup.worldToLocal(localHit);
          }

          if (!hasFirstCursorMove) {
            hasFirstCursorMove = true;
            prevLocalCursor.copy(localHit);
            cursorVelocityX = 0;
            cursorVelocityY = 0;
          } else {
            const rawVx = (localHit.x - prevLocalCursor.x) * 0.45;
            const rawVy = (localHit.y - prevLocalCursor.y) * 0.45;
            cursorVelocityX += (rawVx - cursorVelocityX) * 0.35;
            cursorVelocityY += (rawVy - cursorVelocityY) * 0.35;
            prevLocalCursor.copy(localHit);
          }

          cursorForce = {
            active: true,
            x: localHit.x,
            y: localHit.y,
            z: localHit.z,
            vx: cursorVelocityX,
            vy: cursorVelocityY,
          };
        }
      } else {
        hasFirstCursorMove = false;
        cursorVelocityX *= 0.88;
        cursorVelocityY *= 0.88;
      }

      // Update Simulation Positions, Physics Forces, Convergence & Depth
      simulation.update(
        t,
        breathScale,
        reducedMotion,
        revealObj.progress,
        currentConvergence,
        cursorForce,
        currentActiveSection
      );

      // 3. Update Camera and Interpolated Controls
      cameraController.update(t, reducedMotion);

      // Continuous slow autonomous rotation
      const rotDamping = 1.0 - currentConvergence * 0.55;
      const baseRotY = reducedMotion
        ? 0
        : t * PARTICLE_FIELD_CONFIG.rotation.baseSpeedY * 60 * rotDamping;
      const wobbleX = reducedMotion
        ? 0
        : Math.sin(t * PARTICLE_FIELD_CONFIG.rotation.wobbleSpeedX * 60) *
          PARTICLE_FIELD_CONFIG.rotation.wobbleAmpX;

      currentFieldScale += (targetState.fieldScale - currentFieldScale) * 0.05;
      currentShiftX += (targetState.fieldShiftX - currentShiftX) * 0.05;
      currentShiftY += (targetState.fieldShiftY - currentShiftY) * 0.05;
      currentRotYOffset += (targetState.rotYOffset - currentRotYOffset) * 0.05;
      currentRotXOffset += (targetState.rotXOffset - currentRotXOffset) * 0.05;

      const rotY = baseRotY + currentRotYOffset;
      const rotX = wobbleX + currentRotXOffset;

      if (renderer && scene && worldGroup && particleRenderer) {
        // --- WebGL Render Path ---
        if (!reducedMotion) {
          worldGroup.rotation.y = rotY;
          worldGroup.rotation.x = rotX;
          worldGroup.position.x = currentShiftX;
          worldGroup.position.y = currentShiftY;
          worldGroup.scale.setScalar(currentFieldScale);
        } else {
          worldGroup.rotation.set(0, 0, 0);
          worldGroup.position.set(0, 0, 0);
          worldGroup.scale.set(1, 1, 1);
        }

        connectionSystem.update(
          simulation.particles,
          cameraController.scrollState.connectionAlphaMult,
          revealObj.progress,
          simulation.activeRegion
        );

        particleRenderer.update(
          simulation.particles,
          simulation.ambientParticles,
          currentActiveSection
        );
        renderer.render(scene, cameraController.camera);
      } else if (ctx2d && sprite2d) {
        // --- Canvas 2D 3D-Perspective Render Path ---
        const currentDpr = Math.min(dprCap, window.devicePixelRatio || 1);
        const w = width * currentDpr;
        const h = height * currentDpr;
        const cx = w * 0.5;
        const cy = h * 0.5;
        const focalLength = Math.min(w, h) * 1.1;

        ctx2d.fillStyle = "#000000";
        ctx2d.fillRect(0, 0, w, h);

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const camPos = cameraController.camera.position;
        const particles = simulation.particles;
        const pLen = particles.length;

        // Transform and project particles to 2D
        const projectedX = new Float32Array(pLen);
        const projectedY = new Float32Array(pLen);
        const projectedZ = new Float32Array(pLen);
        const projectedSize = new Float32Array(pLen);
        const projectedAlpha = new Float32Array(pLen);
        const isVisible = new Uint8Array(pLen);

        for (let i = 0; i < pLen; i++) {
          const p = particles[i];
          if (p.revealAlpha <= 0.01) continue;

          // World rotation around Y and X
          const x1 = p.currX * cosY + p.currZ * sinY;
          const z1 = -p.currX * sinY + p.currZ * cosY;

          const y1 = p.currY * cosX - z1 * sinX;
          const z2 = p.currY * sinX + z1 * cosX;

          // Apply field scale and shift
          const worldX = x1 * currentFieldScale + currentShiftX;
          const worldY = y1 * currentFieldScale + currentShiftY;
          const worldZ = z2 * currentFieldScale;

          // Relative to camera
          const dx = worldX - camPos.x;
          const dy = worldY - camPos.y;
          const dz = camPos.z - worldZ;

          if (dz <= 1.0) continue; // Behind camera

          const scale = focalLength / dz;
          const sx = cx + dx * scale;
          const sy = cy - dy * scale;

          projectedX[i] = sx;
          projectedY[i] = sy;
          projectedZ[i] = dz;
          projectedSize[i] = p.currentSize * (32.0 / dz) * currentDpr * 1.4;
          projectedAlpha[i] = Math.min(1.0, Math.max(0.0, p.currentAlpha * Math.pow(34.0 / dz, 0.7)));
          isVisible[i] = 1;
        }

        // 1. Draw 3D Connection Lines
        connectionSystem.update(
          simulation.particles,
          cameraController.scrollState.connectionAlphaMult,
          revealObj.progress,
          simulation.activeRegion
        );

        const positions = (connectionSystem.linesMesh.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        const colors = (connectionSystem.linesMesh.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array;
        const lineDrawCount = connectionSystem.linesMesh.geometry.drawRange.count;

        ctx2d.lineWidth = Math.max(0.7, 0.9 * currentDpr);

        for (let l = 0; l < lineDrawCount; l += 2) {
          const v1 = l * 3;
          const v2 = (l + 1) * 3;

          const intensity = colors[v1];
          if (intensity <= 0.005) continue;

          // Transform Endpoint 1
          const x1 = positions[v1] * cosY + positions[v1 + 2] * sinY;
          const z1 = -positions[v1] * sinY + positions[v1 + 2] * cosY;
          const y1 = positions[v1 + 1] * cosX - z1 * sinX;
          const z1_end = positions[v1 + 1] * sinX + z1 * cosX;
          const dz1 = camPos.z - (z1_end * currentFieldScale);
          if (dz1 <= 1.0) continue;
          const sc1 = focalLength / dz1;
          const sx1 = cx + (x1 * currentFieldScale + currentShiftX - camPos.x) * sc1;
          const sy1 = cy - (y1 * currentFieldScale + currentShiftY - camPos.y) * sc1;

          // Transform Endpoint 2
          const x2 = positions[v2] * cosY + positions[v2 + 2] * sinY;
          const z2 = -positions[v2] * sinY + positions[v2 + 2] * cosY;
          const y2 = positions[v2 + 1] * cosX - z2 * sinX;
          const z2_end = positions[v2 + 1] * sinX + z2 * cosX;
          const dz2 = camPos.z - (z2_end * currentFieldScale);
          if (dz2 <= 1.0) continue;
          const sc2 = focalLength / dz2;
          const sx2 = cx + (x2 * currentFieldScale + currentShiftX - camPos.x) * sc2;
          const sy2 = cy - (y2 * currentFieldScale + currentShiftY - camPos.y) * sc2;

          ctx2d.beginPath();
          ctx2d.moveTo(sx1, sy1);
          ctx2d.lineTo(sx2, sy2);
          ctx2d.strokeStyle = `rgba(195, 222, 255, ${Math.min(0.35, intensity)})`;
          ctx2d.stroke();
        }

        // 2. Draw Ambient Deep Starfield
        const amb = simulation.ambientParticles;
        const ambLen = amb.length;
        for (let a = 0; a < ambLen; a++) {
          const ap = amb[a];
          if (ap.revealAlpha <= 0.01) continue;

          const adz = camPos.z - ap.z;
          if (adz <= 1.0) continue;
          const asc = focalLength / adz;
          const asx = cx + (ap.x - camPos.x) * asc;
          const asy = cy - (ap.y - camPos.y) * asc;
          const asize = ap.size * currentDpr * 0.9;
          const aAlpha = ap.alpha * ap.revealAlpha;

          ctx2d.globalAlpha = aAlpha;
          ctx2d.drawImage(sprite2d, asx - asize * 0.5, asy - asize * 0.5, asize, asize);
        }

        // 3. Draw Constellation Particle Nodes with Luminous Halos
        for (let i = 0; i < pLen; i++) {
          if (!isVisible[i]) continue;
          const size = projectedSize[i];
          const alpha = projectedAlpha[i];
          if (alpha <= 0.01) continue;

          ctx2d.globalAlpha = alpha;
          ctx2d.drawImage(
            sprite2d,
            projectedX[i] - size * 0.5,
            projectedY[i] - size * 0.5,
            size,
            size
          );
        }

        ctx2d.globalAlpha = 1.0;
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    // Robust Cleanup on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("acm:field-focus", handleFieldFocus);

      revealTween.kill();
      stInstances.forEach((st) => st.kill());

      particleRenderer?.dispose();
      connectionSystem.dispose();
      renderer?.dispose();
      scene?.clear();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-black"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Soft atmospheric white/cotton-like haze layer providing gentle spatial depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Primary central-upper soft cotton haze */}
        <div
          className="absolute top-[-8%] left-[12%] w-[76vw] h-[70vh] rounded-full blur-[130px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.16) 0%, rgba(200, 225, 255, 0.06) 45%, transparent 75%)",
          }}
        />
        {/* Secondary flanking subtle atmospheric depth */}
        <div
          className="absolute top-[22%] right-[-6%] w-[55vw] h-[55vh] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(185, 215, 255, 0.10) 0%, transparent 70%)",
          }}
        />
        {/* Lower grounding subtle haze */}
        <div
          className="absolute bottom-[-12%] left-[22%] w-[60vw] h-[50vh] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full block pointer-events-none"
      />
    </div>
  );
}
