#!/usr/bin/env node
/**
 * One-time/occasional build step: parses raw GPX exports in scripts/gpx-source/
 * (gitignored - not checked in) into a small, simplified static JSON file
 * bundled into the Angular app at src/app/shared/variables/races.json.
 *
 * Run manually whenever a GPX file is added/changed:
 *   node scripts/generate-race-data.js
 */
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'gpx-source');
const OUTPUT_FILE = path.join(__dirname, '../src/app/shared/variables/races.json');
const TARGET_POINT_COUNT_MIN = 300;
const TARGET_POINT_COUNT_MAX = 600;
const STOPPED_SPEED_THRESHOLD_MPS = 0.3;
const ELEVATION_SMOOTHING_WINDOW = 21;

function parseGpx(xml) {
  const nameMatch = xml.match(/<trk>\s*<name>([^<]*)<\/name>/);
  const name = nameMatch ? nameMatch[1].trim() : 'Untitled Race';

  const points = [];
  const trkptRegex = /<trkpt lat="(-?[\d.]+)" lon="(-?[\d.]+)">([\s\S]*?)<\/trkpt>/g;
  let match;
  while ((match = trkptRegex.exec(xml)) !== null) {
    const [, lat, lon, body] = match;
    const eleMatch = body.match(/<ele>(-?[\d.]+)<\/ele>/);
    const timeMatch = body.match(/<time>([^<]+)<\/time>/);
    points.push({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ele: eleMatch ? parseFloat(eleMatch[1]) : 0,
      time: timeMatch ? new Date(timeMatch[1]) : null
    });
  }

  return { name, points };
}

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function computeDistanceMeters(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineMeters(points[i - 1], points[i]);
  }
  return total;
}

function computeElevationGainMeters(points) {
  const smoothed = points.map((p, i) => {
    const start = Math.max(0, i - Math.floor(ELEVATION_SMOOTHING_WINDOW / 2));
    const end = Math.min(points.length, i + Math.ceil(ELEVATION_SMOOTHING_WINDOW / 2));
    const window = points.slice(start, end);
    return window.reduce((sum, wp) => sum + wp.ele, 0) / window.length;
  });

  let gain = 0;
  for (let i = 1; i < smoothed.length; i++) {
    const delta = smoothed[i] - smoothed[i - 1];
    if (delta > 0) {
      gain += delta;
    }
  }
  return gain;
}

function computeMovingTimeSeconds(points) {
  let movingSeconds = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a.time || !b.time) continue;

    const dtSeconds = (b.time.getTime() - a.time.getTime()) / 1000;
    if (dtSeconds <= 0) continue;

    const distance = haversineMeters(a, b);
    const speed = distance / dtSeconds;
    if (speed >= STOPPED_SPEED_THRESHOLD_MPS) {
      movingSeconds += dtSeconds;
    }
  }
  return Math.round(movingSeconds);
}

function computeBounds(points) {
  const lats = points.map(p => p.lat);
  const lons = points.map(p => p.lon);
  return [
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)]
  ];
}

// Ramer-Douglas-Peucker simplification, iterating epsilon to hit a target point count.
function perpendicularDistance(point, lineStart, lineEnd) {
  const [x, y] = [point.lon, point.lat];
  const [x1, y1] = [lineStart.lon, lineStart.lat];
  const [x2, y2] = [lineEnd.lon, lineEnd.lat];

  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return Math.hypot(x - x1, y - y1);
  }
  const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));
  const projX = x1 + clampedT * dx;
  const projY = y1 + clampedT * dy;
  return Math.hypot(x - projX, y - projY);
}

function douglasPeucker(points, epsilon) {
  if (points.length < 3) return points;

  let maxDistance = 0;
  let maxIndex = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIndex), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

function simplifyToTargetCount(points) {
  let low = 0;
  let high = 0.01;
  let best = points;

  for (let i = 0; i < 25; i++) {
    const epsilon = (low + high) / 2;
    const simplified = douglasPeucker(points, epsilon);

    if (simplified.length >= TARGET_POINT_COUNT_MIN && simplified.length <= TARGET_POINT_COUNT_MAX) {
      return simplified;
    }
    if (simplified.length > TARGET_POINT_COUNT_MAX) {
      low = epsilon;
    } else {
      high = epsilon;
    }
    best = simplified;
  }
  return best;
}

function slugify(name, date) {
  const year = date ? date.getFullYear() : 'unknown';
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${year}`;
}

function formatDate(date) {
  return date ? date.toISOString().slice(0, 10) : null;
}

function processFile(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8');
  const { name, points } = parseGpx(xml);

  if (points.length === 0) {
    throw new Error(`No trackpoints found in ${filePath}`);
  }

  const distanceMeters = computeDistanceMeters(points);
  const elevationGainMeters = computeElevationGainMeters(points);
  const movingTimeSeconds = computeMovingTimeSeconds(points);
  const bounds = computeBounds(points);
  const simplifiedPoints = simplifyToTargetCount(points).map(p => [p.lat, p.lon]);
  const date = points[0].time;

  return {
    id: slugify(name, date),
    name,
    date: formatDate(date),
    distanceMeters: Math.round(distanceMeters),
    elevationGainMeters: Math.round(elevationGainMeters),
    movingTimeSeconds,
    points: simplifiedPoints,
    bounds
  };
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.gpx'));
  if (files.length === 0) {
    console.error(`No .gpx files found in ${SOURCE_DIR}`);
    process.exit(1);
  }

  const races = files.map(file => {
    const filePath = path.join(SOURCE_DIR, file);
    const race = processFile(filePath);
    console.log(
      `${file} -> ${race.id}: ${(race.distanceMeters / 1609.34).toFixed(2)} mi, ` +
      `${Math.round(race.elevationGainMeters * 3.28084)} ft gain, ` +
      `${Math.round(race.movingTimeSeconds / 60)} min moving, ` +
      `${race.points.length} route points`
    );
    return race;
  });

  races.sort((a, b) => (a.date < b.date ? 1 : -1));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(races, null, 2));
  console.log(`\nWrote ${races.length} races to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main();
