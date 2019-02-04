import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
  @Input() upBorder: number;
  @Input() downBorder: number;
  @Output() downScrolled = new EventEmitter<number>();
  @Output() upScrolled = new EventEmitter<number>();

  private downMarker: number;
  private protect: boolean;

  constructor(private elementRef: ElementRef) {
    this.protect = true;
  }

  @HostListener('scroll', ['$event']) onScroll(e) {
    this.downMarker = ((this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight)
                      / this.elementRef.nativeElement.scrollHeight) * 100;
    // if (e.srcElement.scrollTop > (this.elementRef.nativeElement.scrollHeight -
    //   (this.elementRef.nativeElement.scrollHeight / 100 * 75)) &&
    //   e.srcElement.scrollTop < (this.elementRef.nativeElement.scrollHeight -
    //     (this.elementRef.nativeElement.scrollHeight / 100 * 25))) {
    //   this.protect = false;
    // }
    if (e.srcElement.scrollTop > (this.elementRef.nativeElement.scrollHeight -
      (this.elementRef.nativeElement.scrollHeight / 100 * 85)) &&
      e.srcElement.scrollTop < (this.elementRef.nativeElement.scrollHeight * ((this.downMarker - 10) / 100))) {
      this.protect = false;
    }
    // if (e.srcElement.scrollTop > (this.elementRef.nativeElement.scrollHeight -
    //   (this.elementRef.nativeElement.scrollHeight / 100 * this.downBorder))
    //   && !this.protect) {

    if (e.srcElement.scrollTop > (this.elementRef.nativeElement.scrollHeight * ((this.downMarker - 10) / 100))
        && !this.protect) {

      this.protect = true;
      this.downScrolled.emit(this.elementRef.nativeElement.scrollHeight * ((this.upBorder + 5) / 100));
    }

    if (e.srcElement.scrollTop < (this.elementRef.nativeElement.scrollHeight / 100 * this.upBorder)
      && !this.protect) {

      this.protect = true;
      this.upScrolled.emit(this.elementRef.nativeElement.scrollHeight * ((this.downMarker - 5) / 100));
    }

  }
}
