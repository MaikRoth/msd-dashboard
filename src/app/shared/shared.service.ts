import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
    private backgroundColorSource = new BehaviorSubject<string>('#ffffff');
    backgroundColor = this.backgroundColorSource.asObservable();
    private robotImageSizeSource = new BehaviorSubject<string>('small');
    robotImageSize = this.robotImageSizeSource.asObservable();

    changeBackgroundColor(color: string) {
        this.backgroundColorSource.next(color);
    }
    
    setRobotImageSize(size: string) {
        this.robotImageSizeSource.next(size);
    }
}