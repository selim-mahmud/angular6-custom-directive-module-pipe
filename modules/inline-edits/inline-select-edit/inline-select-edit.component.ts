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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'inline-select-edit',
    templateUrl: 'app/shared/modules/inline-edits/inline-select-edit/inline-select-edit.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InlineSelectEditComponent),
            multi: true
        }
    ]
})
export class InlineSelectEditComponent implements ControlValueAccessor, OnInit {

    /** input control **/
    @ViewChild('inlineSelectControl') inlineSelectControl: ElementRef;

    @Input() selectOptionsMapper: object;
    @Input() editIconPosition: string = 'right';
    @Input() panelClass: string;
    @Output() public onSave: EventEmitter<any> = new EventEmitter();
    selectOptions: string[];
    style: string;

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
        this.selectOptions = Object.keys(this.selectOptionsMapper);
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
        this.editing = false;
        this.isEditIcon = false;
    }

    // confirm the change
    onDropdownChange($event: Event) {
        this.editing = false;
        this.isEditIcon = false;
        this.onSave.emit({'currentValue':this.value, 'preValue':this.preValue});
    }

    showEditIcon() {
        this.isEditIcon = true;
        this.editing = true;
    }

    hideEditIcon() {
        this.isEditIcon = false;
        this.editing = false;
    }

}