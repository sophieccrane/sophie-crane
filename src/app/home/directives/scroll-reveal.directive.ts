import {Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Directive({
  selector: '[appScrollReveal]'
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() appScrollRevealDelay = 0;

  private observer: IntersectionObserver | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    const el = this.elementRef.nativeElement;
    el.classList.add('scroll-reveal');

    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    if (this.appScrollRevealDelay) {
      el.style.transitionDelay = `${this.appScrollRevealDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
