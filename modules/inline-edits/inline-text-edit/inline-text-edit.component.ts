import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    Renderer,
    forwardRef,
    OnInit,
    Renderer2,
    Inject,
    HostListener,
    Output, 
    EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'inline-text-edit',
    templateUrl: 'app/shared/modules/inline-edits/inline-text-edit/inline-text-edit.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InlineTextEditComponent),
            multi: true
        }
    ]
})
export class InlineTextEditComponent implements ControlValueAccessor, OnInit {

    /** input control **/
    @ViewChild('inlineTextEditComponent') inlineTextEditComponent: ElementRef;

    @Input() required: boolean = false;
    @Input() validationDir: boolean = false;
    @Input() minLength: number;
    @Input() maxLength: number;
    @Output() public onSave: EventEmitter<any> = new EventEmitter();

    textValue: string;

    /** private value of input **/
    private _value = '';
    /** value prior to editing **/
    private preValue = '';
    /** We are editing **/
    public editing = false;
    /** Callback when the value is changing **/
    public onChange: any = Function.prototype;
    /** Callback when the input is accessed **/
    public onTouched: any = Function.prototype;
    

    isEditIcon: boolean = false;

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    // ControlValueAccessor interface impl
    writeValue(value: any) {
        if (value !== undefined) {
            this._value = value;
        }
    }

    // ControlValueAccessor interface impl
    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    // ControlValueAccessor interface impl
    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    constructor(
        @Inject(ElementRef) private _element: ElementRef,
        @Inject(Renderer2) private _renderer: Renderer2
    ) { }

    ngOnInit() {
    }

    // Start editing
    edit(value) {
        this.preValue = value;
        this.editing = true;
        this.isEditIcon = false;
    }

    // cancel editing
    cancel() {
        this.value = this.preValue;
        this.textValue = this.preValue;
        this.editing = false;
        this.isEditIcon = false;
    }

    // confirm the change
    confirm($event: Event) {
        this.editing = false;
        this.isEditIcon = false;
        this.onSave.emit({ 'currentValue': this.value, 'preValue': this.preValue });
    }

    showEditIcon() {
        this.isEditIcon = true;
    }

    hideEditIcon() {
        this.isEditIcon = false;
    }

    //click event outside of the elements
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!this._element.nativeElement.contains(event.target)) { //if clicks outside of the element
            this.editing = false;
            this.isEditIcon = false;
        } 
    }

}