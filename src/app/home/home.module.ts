import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomePageContainerComponent } from './containers/home-page-container.component';
import {HomeRoutingModule} from "./home-routing.module";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { RacesComponent } from './components/races/races.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';


@NgModule({
  declarations: [
    HomePageContainerComponent,
    NavBarComponent,
    EducationComponent,
    ExperienceComponent,
    RacesComponent,
    ScrollRevealDirective
  ],
    imports: [
        CommonModule, HomeRoutingModule, NgOptimizedImage
    ]
})
export class HomeModule { }
