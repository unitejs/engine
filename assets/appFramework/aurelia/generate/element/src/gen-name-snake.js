/**
 * Gen Name Human element class.
 *
 * @export
 * @class GenNamePascal
 */
import {bindable} from "aurelia-templating";

export class GenNamePascal {
    /**
     * Bindable value for the element.
     * @type {string}
     */
    @bindable
    value;

    /**
     * Element value has changed.
     * @param {any} newValue
     * @param {any} oldValue
     * @returns {void}
     */
    valueChanged(newValue, oldValue) {
    }
}
