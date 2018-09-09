import { Directive, ElementRef, HostListener, Inject } from '@angular/core';

@Directive({
    selector: '[onlyInteger]'
})
export class OnlyIntegerDirective {
    // Allow decimal numbers.
    private regex: RegExp = new RegExp(/^[0-9]*$/g);

    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    constructor( @Inject(ElementRef) private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}