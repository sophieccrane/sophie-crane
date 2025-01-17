import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() clickEvent = new EventEmitter<string>();

  closed: boolean = true;

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
