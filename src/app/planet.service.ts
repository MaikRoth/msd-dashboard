import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResourceType } from "./map/robot/robot.component";
import { Planet } from "./map/planet/planet.component";
import { Subject } from "rxjs";

interface Resource {
    amount: number;
    capacity: number;
}
@Injectable({
    providedIn: 'root'
})
export class PlanetService {

    private planetsEndpoint = "http://localhost:8096/planets"
    constructor(private http: HttpClient) { }

    private planets: Planet[] = [];

    fetchPlanets() {
        return this.http.get(this.planetsEndpoint).subscribe({
            next: (res: Planet[]) => {
                this.planets = res.map(planetData => this.mapToPlanet(planetData));
            },
            error: (error) => {
                console.error('Error fetching planets:', error);
                return [error]
            }
        });
    }

    getPlanets(): Planet[] {
        this.fetchPlanets()
        return this.planets;
    }

    getPlanet(planetId: string): Planet {
        return this.planets.find(planet => { planet.planetId == planetId })
    }

    private mapToPlanet(obj: any): Planet {
        return {
            planetId: obj.planetId,
            resourceType: this.toResourceType(obj.resourceType),
            movementDifficulty: obj.movementDifficulty,
            resource: this.isResource(obj.resource) ? obj.resource : { amount: 0, capacity: 0 },
            position: this.hasPosition(obj)
                ? obj.traits[0].data.position
                : { x: 0, y: 0 },
            robots: [],
            highlighted: false,
        };
    }
    private isResource(obj: any): obj is Resource {
        return (
            obj && typeof obj.amount === 'number' && typeof obj.capacity === 'number'
        );
    }

    private hasPosition(obj: any): boolean {
        return obj.traits[0]?.data?.position;
    }
    private toResourceType(resourceTypeStr: string | null): ResourceType {
        if (resourceTypeStr === null || resourceTypeStr === undefined) {
            return ResourceType.NOTHING;
        }
        return ResourceType[resourceTypeStr];
    }
}