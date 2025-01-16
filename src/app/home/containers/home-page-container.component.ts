import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page-container',
  templateUrl: './home-page-container.component.html',
  styleUrls: ['./home-page-container.component.scss']
})
export class HomePageContainerComponent {

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });
  }

  jumpToSection(section: string | null) {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });

  }

}
