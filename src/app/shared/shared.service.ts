import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private backgroundColorSource = new BehaviorSubject<string>('#ffffff');
    backgroundColor = this.backgroundColorSource.asObservable();
    private robotImageSizeSource = new BehaviorSubject<string>('small');
    robotImageSize = this.robotImageSizeSource.asObservable();

    constructor() {
        this.loadTheme();
    }
    changeBackgroundColor(color: string) {
        this.backgroundColorSource.next(color);
    }

    setRobotImageSize(size: string) {
        this.robotImageSizeSource.next(size);
    }
    private isDarkMode = false;

    toggleDarkMode(): void {
        this.isDarkMode = !this.isDarkMode;
        this.updateBodyClass();
        this.saveTheme();
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