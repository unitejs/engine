/**
 * Gen Name Human attribute class.
 *
 * @export
 * @class GenNamePascalAttribute
 */
import {inject} from "aurelia-dependency-injection";

@inject(Element)
export class GenNamePascalAttribute {
    /**
     * Creates an instance of GenNamePascalAttribute.
     */
    constructor(element) {
        this._element = element;
    }

    /**
     * Attribute value has changed
     * @param {any} newValue
     * @param {any} oldValue
     * @returns {void}
     */
    valueChanged(newValue, oldValue) {
    }
}
