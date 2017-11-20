/**
 * {GEN_NAME_HUMAN} attribute class.
 */
import { inject } from "aurelia-dependency-injection";

@inject(Element)
export class {GEN_NAME_PASCAL}Attribute {
    /**
     * Creates an instance of {GEN_NAME_PASCAL}.
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
