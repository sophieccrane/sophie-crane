import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import * as L from 'leaflet';
import * as racesData from '@shared/variables/races.json';
import * as pageVariables from '@shared/variables/page-variables.json';
import { Race } from '../../types/race.model';

const START_MARKER_COLOR = '#22c55e';
const FINISH_MARKER_COLOR = '#ef4444';
const ROUTE_LINE_COLOR = 'rgb(139 92 246)';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.scss']
})
export class RacesComponent implements AfterViewInit, OnDestroy {
  pageData: any = (pageVariables as any).default.racesPage;
  races: Race[] = (racesData as any).default;

  @ViewChildren('mapContainer') mapContainers!: QueryList<ElementRef<HTMLElement>>;
  private _maps: L.Map[] = [];

  ngAfterViewInit(): void {
    this.mapContainers.forEach((container, index) => {
      const race = this.races[index];
      this._maps.push(this._buildMap(container.nativeElement, race));
    });
  }

  ngOnDestroy(): void {
    this._maps.forEach(map => map.remove());
  }

  blurbFor(race: Race): string {
    return this.pageData.blurbs[race.id] ?? '';
  }

  formatDistance(meters: number): string {
    return `${(meters / 1609.34).toFixed(2)} mi`;
  }

  formatElevation(meters: number): string {
    return `${Math.round(meters * 3.28084)} ft`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatPace(race: Race): string {
    const miles = race.distanceMeters / 1609.34;
    const paceSecondsPerMile = race.movingTimeSeconds / miles;
    const paceMinutes = Math.floor(paceSecondsPerMile / 60);
    const paceSeconds = Math.round(paceSecondsPerMile % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /mi`;
  }

  formatDate(isoDate: string): string {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  private _buildMap(element: HTMLElement, race: Race): L.Map {
    const map = L.map(element, {
      scrollWheelZoom: false,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.polyline(race.points, { color: ROUTE_LINE_COLOR, weight: 3 }).addTo(map);

    L.circleMarker(race.points[0], {
      radius: 6,
      color: START_MARKER_COLOR,
      fillColor: START_MARKER_COLOR,
      fillOpacity: 1
    }).addTo(map);

    L.circleMarker(race.points[race.points.length - 1], {
      radius: 6,
      color: FINISH_MARKER_COLOR,
      fillColor: FINISH_MARKER_COLOR,
      fillOpacity: 1
    }).addTo(map);

    map.fitBounds(race.bounds, { padding: [16, 16] });

    return map;
  }
}
