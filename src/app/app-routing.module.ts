import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ControlpanelComponent } from "./controlpanel/controlpanel.component";
import { MapComponent } from "./map/map.component";
import { ScoreboardComponent } from "./scoreboard/scoreboard.component";
import { HomeComponent } from "./home/home.component";

const appRoutes : Routes = [
    {path: 'controlpanel', component: ControlpanelComponent},
    {path: 'map', component: MapComponent},
    {path: 'scoreboard', component: ScoreboardComponent},
    {path: '', component: HomeComponent},
]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}