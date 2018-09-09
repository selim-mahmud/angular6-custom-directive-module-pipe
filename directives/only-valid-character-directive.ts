import { Directive, ElementRef, HostListener, Inject } from '@angular/core';

@Directive({
    selector: '[onlyValidCharacter]'
})
export class OnlyValidCharacterDirective {
    //Don't allow "<" followed by a letter or by "/" and &# combo
    private regex: RegExp = new RegExp(/^((?!<[a-zA-Z\/]|(&#)).)*$/g);

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