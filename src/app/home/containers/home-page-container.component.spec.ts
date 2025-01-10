import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageContainerComponent } from './home-page-container.component';

describe('HomePageContainerComponent', () => {
  let component: HomePageContainerComponent;
  let fixture: ComponentFixture<HomePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageContainerComponent]
    });
    fixture = TestBed.createComponent(HomePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
