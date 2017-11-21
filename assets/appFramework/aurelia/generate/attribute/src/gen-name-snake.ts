/**
 * Gen Name Human attribute class.
 *
 * @export
 * @class GenNamePascalAttribute
 */
import { inject } from "aurelia-dependency-injection";

@inject(Element)
export class GenNamePascalAttribute {
    private _element: Element;

    /**
     * Creates an instance of GenNamePascalAttribute.
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
