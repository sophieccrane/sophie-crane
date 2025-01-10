import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageContainerComponent } from './containers/home-page-container.component';
import {HomeRoutingModule} from "./home-routing.module";



@NgModule({
  declarations: [
    HomePageContainerComponent
  ],
  imports: [
    CommonModule, HomeRoutingModule
  ]
})
export class HomeModule { }
