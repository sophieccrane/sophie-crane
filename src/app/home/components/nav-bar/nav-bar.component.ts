import {Component, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() clickEvent = new EventEmitter<string>();
  @Input() activeSection: string | undefined;

  closed = true;
  isScrolled = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 8;
    }
  }

  sendFragment(fragment: string) {
    this.clickEvent.emit(fragment);
    if(!this.closed) {
      this.closeAndOpenMenu();
    }
  }

  closeAndOpenMenu() {
    this.closed = !this.closed;
  }

}
