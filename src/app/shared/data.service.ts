import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { Planet } from "../map/planet/planet.component";
import { Robot } from "../map/robot/robot.component";

@Injectable({ providedIn: 'root' })
export class DataService {
  private planetsSubject = new BehaviorSubject<Planet[]>([]);
  private robotsSubject = new BehaviorSubject<Robot[]>([]);
  private gridSubject = new BehaviorSubject<(Planet | null)[][]>([]);

  planets$ = this.planetsSubject.asObservable();
  robots$ = this.robotsSubject.asObservable();
  grid$ = this.gridSubject.asObservable();
  grid: any;
  planets: any;

  constructor(private httpClient: HttpClient) {}

  fetchPlanets() {
    this.httpClient.get<Planet[]>('http://localhost:8096/planets').subscribe(planets => {
      this.planetsSubject.next(planets);
      this.setupGrid()
    });
  }

  fetchRobots() {
    this.httpClient.get<Robot[]>('http://localhost:8096/robots').subscribe(robots => {
      this.robotsSubject.next(robots);
    });
  }

  setupGrid() {
    combineLatest([this.planets$, this.calculateMaxX(), this.calculateMaxY()])
      .pipe(
        map(([planets, maxX, maxY]) => {
          for (let i = 0; i <= maxY; i++) {
            this.grid[i] = [];
            for (let j = 0; j <= maxX; j++) {
              this.grid[i][j] = null;
            }
          }
  
          for (let planet of planets) {
            const position = this.getPosition(planet);
            this.grid[position.y][position.x] = planet;
          }
        })
      )
      .subscribe();
  }
  
  calculateMaxX() {
    return this.planets$.pipe(
      map(planets => Math.max(...planets.map(p => this.getPosition(p).x)))
    );
  }
  
  calculateMaxY() {
    return this.planets$.pipe(
      map(planets => Math.max(...planets.map(p => this.getPosition(p).y)))
    );
  }
  private getPosition(planet: Planet): { x: number; y: number } {
    return planet.position || { x: 0, y: 0 };
  }

}
