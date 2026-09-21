export interface ComputationalFieldProps {
  isMobile?: boolean;
  className?: string;
  onFrame?: (currentTime: number) => void;
  paused?: boolean;
  reducedMotion?: boolean;
}

export interface SimulationParams {
  time: number; // Elapsed seconds (0.00 to 9.10)
  cameraScale: number; // 1.00 to 1.06
}
