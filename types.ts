export interface AizawaParams {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export const DEFAULT_PARAMS: AizawaParams = {
  a: 0.95,
  b: 0.7,
  c: 0.6,
  d: 3.5,
  e: 0.25,
  f: 0.1,
};

export interface VisualizationSettings {
  particleCount: number;
  speed: number;
  opacity: number;
  pointSize: number;
  trail: boolean;
}

export const DEFAULT_SETTINGS: VisualizationSettings = {
  particleCount: 15000,
  speed: 1.0,
  opacity: 0.6,
  pointSize: 0.08,
  trail: false,
};
