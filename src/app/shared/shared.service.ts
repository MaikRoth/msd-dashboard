import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private backgroundColorSource = new BehaviorSubject<string>('#ffffff');
    backgroundColor = this.backgroundColorSource.asObservable();
    private mapScaleSource = new BehaviorSubject<number>(1); 
    mapScale = this.mapScaleSource.asObservable();
    private landscapeBackgroundSource = new BehaviorSubject<boolean>(false);
    private robotImageTypeSource = new BehaviorSubject<string>('random');
    robotImageType = this.robotImageTypeSource.asObservable();

    constructor() {
        this.loadTheme();
    }
    setLandscapeBackground(show: boolean) {
        this.landscapeBackgroundSource.next(show);
    }
    get landscapeBackground() {
        return this.landscapeBackgroundSource.asObservable();
    }
    setMapScale(scale: number) {
        this.mapScaleSource.next(scale);
    }

    changeBackgroundColor(color: string) {
        this.backgroundColorSource.next(color);
    }

    private isDarkMode = false;

    toggleDarkMode(): void {
        this.isDarkMode = !this.isDarkMode;
        this.updateBodyClass();
        this.saveTheme();
    }
    
    setRobotImageType(type: string) {
        this.robotImageTypeSource.next(type);
    }
    private updateBodyClass(): void {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
    }

    private saveTheme(): void {
        localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
    }

    private loadTheme(): void {
        const savedMode = localStorage.getItem('darkMode');
        this.isDarkMode = savedMode === 'true';
        this.updateBodyClass();
    }
}