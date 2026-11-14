import type { City } from "@/content/home";

/**
 * Simplified UK outline drawn from approximate [longitude, latitude]
 * coastline points, so city pins can be placed by real coordinates.
 * Pure SVG: no map library, no network requests, tiny payload.
 */
type LonLat = readonly [number, number];

// prettier-ignore
const GREAT_BRITAIN: LonLat[] = [
  [-3.37, 58.67], [-3.03, 58.64], [-3.09, 58.44], [-3.65, 58.12],
  [-3.77, 57.86], [-4.22, 57.5], [-3.28, 57.72], [-2.0, 57.69],
  [-1.78, 57.5], [-2.08, 57.15], [-2.47, 56.71], [-2.58, 56.28],
  [-3.2, 56.05], [-2.72, 56.06], [-2.0, 55.77], [-1.42, 55.02],
  [-1.2, 54.69], [-0.61, 54.49], [-0.08, 54.12], [0.11, 53.58],
  [0.34, 53.14], [0.2, 52.88], [0.49, 52.95], [1.3, 52.93],
  [1.73, 52.6], [1.75, 52.48], [1.35, 51.96], [1.15, 51.79],
  [0.71, 51.54], [0.4, 51.45], [1.38, 51.39], [1.31, 51.13],
  [0.97, 50.91], [0.25, 50.74], [-0.14, 50.82], [-0.79, 50.73],
  [-1.09, 50.79], [-1.88, 50.71], [-2.45, 50.55], [-2.94, 50.72],
  [-3.41, 50.62], [-3.64, 50.22], [-4.14, 50.37], [-5.2, 49.96],
  [-5.71, 50.07], [-5.48, 50.21], [-5.08, 50.42], [-4.53, 51.02],
  [-4.12, 51.21], [-3.47, 51.21], [-2.98, 51.35], [-2.65, 51.55],
  [-3.17, 51.46], [-3.94, 51.6], [-4.32, 51.56], [-4.7, 51.67],
  [-5.31, 51.9], [-4.66, 52.1], [-4.08, 52.41], [-4.05, 52.72],
  [-4.77, 52.8], [-4.27, 53.14], [-4.63, 53.31], [-4.34, 53.41],
  [-3.83, 53.33], [-3.32, 53.35], [-3.05, 53.42], [-3.01, 53.65],
  [-3.05, 53.82], [-2.87, 54.07], [-3.23, 54.11], [-3.64, 54.51],
  [-3.5, 54.71], [-3.1, 54.95], [-3.6, 54.88], [-4.4, 54.85],
  [-4.86, 54.64], [-5.16, 55.0], [-4.86, 55.24], [-4.63, 55.46],
  [-4.87, 55.8], [-4.9, 55.95], [-5.35, 55.6], [-5.6, 55.3],
  [-5.75, 55.6], [-5.6, 56.0], [-5.47, 56.41], [-6.22, 56.73],
  [-5.83, 57.0], [-5.71, 57.28], [-5.85, 57.5], [-5.8, 57.75],
  [-5.16, 57.9], [-5.25, 58.15], [-5.0, 58.62], [-4.75, 58.57],
  [-4.4, 58.53], [-3.52, 58.6],
];

// prettier-ignore
const NORTHERN_IRELAND: LonLat[] = [
  [-7.4, 55.05], [-6.5, 55.22], [-6.05, 55.2], [-5.8, 54.85],
  [-5.5, 54.6], [-5.55, 54.35], [-5.9, 54.2], [-6.25, 54.08],
  [-6.6, 54.05], [-7.0, 54.2], [-7.6, 54.15], [-8.15, 54.45],
  [-7.6, 54.75], [-7.55, 54.9],
];

// prettier-ignore
const ISLE_OF_WIGHT: LonLat[] = [
  [-1.58, 50.67], [-1.3, 50.77], [-1.07, 50.68], [-1.3, 50.58],
];

// Equirectangular projection scaled by cos(latitude) so Britain isn't stretched.
const LON_MIN = -8.4;
const LAT_MAX = 58.9;
const SCALE = 60;
const LON_FACTOR = Math.cos((54.5 * Math.PI) / 180);

function project([lon, lat]: LonLat) {
  return {
    x: (lon - LON_MIN) * LON_FACTOR * SCALE,
    y: (LAT_MAX - lat) * SCALE,
  };
}

function toPath(points: LonLat[]) {
  return (
    points
      .map((p, i) => {
        const { x, y } = project(p);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

const WIDTH = Math.ceil((2.1 - LON_MIN) * LON_FACTOR * SCALE);
const HEIGHT = Math.ceil((LAT_MAX - 49.7) * SCALE);

export function UkCoverageMap({ cities }: { cities: City[] }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-labelledby="uk-map-title uk-map-desc"
      className="h-auto w-full max-w-xs sm:max-w-sm"
    >
      <title id="uk-map-title">UK coverage map</title>
      <desc id="uk-map-desc">
        Map of the United Kingdom with pins on {cities.length} featured cities:{" "}
        {cities.map((c) => c.name).join(", ")}.
      </desc>
      <g
        className="fill-ink-soft stroke-gold/60"
        strokeWidth={1.5}
        strokeLinejoin="round"
      >
        <path d={toPath(GREAT_BRITAIN)} />
        <path d={toPath(NORTHERN_IRELAND)} />
        <path d={toPath(ISLE_OF_WIGHT)} />
      </g>
      {cities.map((city) => {
        const { x, y } = project([city.lon, city.lat]);
        return (
          <g key={city.name} aria-hidden="true">
            <circle cx={x} cy={y} r={9} className="fill-gold/25" />
            <circle cx={x} cy={y} r={4} className="fill-gold" />
          </g>
        );
      })}
    </svg>
  );
}
