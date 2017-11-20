/**
 * {GEN_NAME_HUMAN} attribute class.
 *
 * @export
 * @class {GEN_NAME_PASCAL}
 */
import { inject } from "aurelia-dependency-injection";

@inject(Element)
export class {GEN_NAME_PASCAL}Attribute {
    private _element: Element;

    /**
     * Creates an instance of {GEN_NAME_PASCAL}.
     */
    constructor(element: Element) {
        this._element = element;
    }

    /**
     * Attribute value has changed.
     * @param {any} newValue
     * @param {any} oldValue
     * @returns {void}
     */
    public valueChanged(newValue: any, oldValue: any): void {
    }
}
