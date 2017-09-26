/**
 * {GEN_NAME_HUMAN} component class.
 */
import { inject } from "aurelia-dependency-injection";

@inject(Element)
export class {GEN_NAME_PASCAL}Attribute {
    private _element: Element;

    constructor(element: Element) {
        this._element = element;
    }

    public valueChanged(newValue: string, oldValue: string): void {
    }
}
