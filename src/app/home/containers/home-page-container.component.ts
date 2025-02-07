import {Component, HostListener, Inject, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import * as data from "@shared/variables/page-variables.json";

@Component({
  selector: 'app-home-page-container',
  templateUrl: './home-page-container.component.html',
  styleUrls: ['./home-page-container.component.scss']
})
export class HomePageContainerComponent {
  receivedFragment: string | undefined;
  pageData: any = (data as any).default;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.jumpToSection("Home");
  }

  receiveFragment($event: string) {
    this.receivedFragment = $event;
    this.jumpToSection(this.receivedFragment);
  }

  jumpToSection(section: string | null) {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });

  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const sections = this.document.querySelectorAll('section');
      let currentSectionId = '';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom > 0) {
          currentSectionId = section.id;
        }
      });

      if (currentSectionId) {
        this.router.navigate([], { fragment : currentSectionId });
      }
    }
  }

}
