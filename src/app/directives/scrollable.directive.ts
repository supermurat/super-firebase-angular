import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Scrollable Directive
 */
@Directive({
    selector: '[appScrollable]'
})
export class ScrollableDirective {

    /** scroll position event emitter */
    @Output() readonly scrollPosition = new EventEmitter();

    /**
     * constructor of ScrollableDirective
     * @param el: ElementRef
     */
    constructor(public el: ElementRef) {
    }

    /**
     * onScroll event listener
     * @param event: scroll event
     */
    @HostListener('scroll', ['$event']) onScroll(event): void {
        try {
            const top = event.target.scrollTop;
            const height = this.el.nativeElement.scrollHeight;
            const offset = this.el.nativeElement.offsetHeight;

            if (top > height - offset - 1) {
                this.scrollPosition.emit('bottom');
            }

            if (top <= 0) {
                this.scrollPosition.emit('top');
            }

        } catch (err) {
            // console.error('Error within ScrollableDirective : ', err);
        }
    }
}
