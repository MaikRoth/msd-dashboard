import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SidebarComponent } from './map/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LogComponent } from './controlpanel/log/log.component';
import { HttpClientModule } from '@angular/common/http';
import { PlanetComponent } from './map/planet/planet.component';
import { GameComponent } from './controlpanel/log/game/game.component';
import { PlayerComponent } from './map/player/player.component';
import { RobotComponent } from './map/robot/robot.component';
import { SettingsbarComponent } from './map/settingsbar/settingsbar.component';
import { StoreModule } from '@ngrx/store';
import { gameReducer } from './controlpanel/game.reducer';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    AppComponent,
    ControlpanelComponent,
    HeaderComponent,
    MapComponent,
    ScoreboardComponent,
    SidebarComponent,
    LogComponent,
    PlanetComponent,
    GameComponent,
    PlayerComponent,
    RobotComponent,
    SettingsbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ game: gameReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
