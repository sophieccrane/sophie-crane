import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageContainerComponent } from './containers/home-page-container.component';
import {HomeRoutingModule} from "./home-routing.module";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';



@NgModule({
  declarations: [
    HomePageContainerComponent,
    NavBarComponent
  ],
  imports: [
    CommonModule, HomeRoutingModule
  ]
})
export class HomeModule { }
