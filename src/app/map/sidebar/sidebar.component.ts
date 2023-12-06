import { Component, Input } from '@angular/core';
import { Player } from '../player/player.component';
import { PlayerService } from '../../player.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    @Input() players : Player[];
    @Input() fetching : boolean;
    info = 'No Highlight'
    
    constructor (private playerService : PlayerService) {}
}
