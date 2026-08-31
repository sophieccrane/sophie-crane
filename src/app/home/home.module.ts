import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomePageContainerComponent } from './containers/home-page-container.component';
import {HomeRoutingModule} from "./home-routing.module";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';


@NgModule({
  declarations: [
    HomePageContainerComponent,
    NavBarComponent,
    SpotifyComponent,
    EducationComponent,
    ExperienceComponent,
    ScrollRevealDirective
  ],
    imports: [
        CommonModule, HomeRoutingModule, NgOptimizedImage
    ]
})
export class HomeModule { }
