/**
 * ACM FACE — Identity Targets Generation & Sampling
 * 
 * Generates coordinate targets for particle constellation assembly.
 * Swappable interface: accepts either typography (current "ACM", "ACM FACE")
 * or a future official SVG mark, rasterizing offscreen and sampling target points
 * without modifying the simulation engine.
 */

export interface TargetPoint {
  x: number;
  y: number;
  importance: number; // 0 to 1 weighting for stroke centers/junctions
}

export type IdentitySource =
  | {
      type: "text";
      text: string;
      fontSize: number;
      fontWeight?: string;
      fontFamily?: string;
      letterSpacing?: number;
    }
  | {
      type: "svg";
      svgPathOrString: string;
    };

export interface TargetBounds {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

// In-memory cache keyed by serialized params to prevent redundant canvas operations
const targetsCache = new Map<string, TargetPoint[]>();

/**
 * Samples target coordinates from the specified identity source.
 * Pure function with offscreen canvas sampling and internal caching.
 */
export function getIdentityTargets(
  source: IdentitySource,
  bounds: TargetBounds,
  count: number = 128
): TargetPoint[] {
  const { width, height, centerX, centerY } = bounds;
  const cacheKey = JSON.stringify({ source, width: Math.round(width), height: Math.round(height), count });

  const cached = targetsCache.get(cacheKey);
  if (cached && cached.length === count) {
    return cached;
  }

  if (typeof document === "undefined" || width <= 0 || height <= 0) {
    return createGeometricFallbackTargets(centerX, centerY, count);
  }

  try {
    const offscreen = document.createElement("canvas");
    offscreen.width = Math.max(10, Math.floor(width));
    offscreen.height = Math.max(10, Math.floor(height));
    const ctx = offscreen.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      return createGeometricFallbackTargets(centerX, centerY, count);
    }

    ctx.clearRect(0, 0, offscreen.width, offscreen.height);

    if (source.type === "text") {
      const weight = source.fontWeight || "600";
      const family = source.fontFamily || "system-ui, -apple-system, sans-serif";
      ctx.font = `${weight} ${source.fontSize}px ${family}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (source.letterSpacing && "letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = `${source.letterSpacing}px`;
      }

      ctx.fillText(source.text, centerX, centerY);
    } else {
      // Future SVG rendering support:
      // SVG markup / Image drawing onto offscreen context
      return createGeometricFallbackTargets(centerX, centerY, count);
    }

    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imgData.data;
    const candidates: Array<{ x: number; y: number; weight: number }> = [];

    // Step through pixels and collect candidate points with alpha > 128
    const step = Math.max(2, Math.floor(source.fontSize / 35));
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const idx = (y * offscreen.width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 140) {
          // Check local neighborhood density to weight towards stroke centers
          let neighborCount = 0;
          const r = step * 2;
          for (let dy = -r; dy <= r; dy += step) {
            for (let dx = -r; dx <= r; dx += step) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < offscreen.width && ny >= 0 && ny < offscreen.height) {
                const nIdx = (ny * offscreen.width + nx) * 4;
                if (data[nIdx + 3] > 140) neighborCount++;
              }
            }
          }
          candidates.push({ x, y, weight: neighborCount * (alpha / 255) });
        }
      }
    }

    if (candidates.length === 0) {
      return createGeometricFallbackTargets(centerX, centerY, count);
    }

    // Uniform spatial downsampling to reach target `count`
    const targets: TargetPoint[] = [];
    const stride = candidates.length / count;
    for (let i = 0; i < count; i++) {
      const idx = Math.min(Math.floor(i * stride), candidates.length - 1);
      const c = candidates[idx];
      targets.push({
        x: c.x,
        y: c.y,
        importance: Math.min(c.weight / 15, 1.0),
      });
    }

    targetsCache.set(cacheKey, targets);
    return targets;
  } catch {
    return createGeometricFallbackTargets(centerX, centerY, count);
  }
}

/**
 * Fallback targets in case DOM or canvas is not yet ready
 */
function createGeometricFallbackTargets(cx: number, cy: number, count: number): TargetPoint[] {
  const pts: TargetPoint[] = [];
  const w = 180;
  const h = 50;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    pts.push({
      x: cx + Math.cos(t) * (w * 0.5),
      y: cy + Math.sin(t) * (h * 0.5),
      importance: 0.5,
    });
  }
  return pts;
}

/**
 * Clears the targets cache (called on viewport resize)
 */
export function clearTargetsCache(): void {
  targetsCache.clear();
}
