/**
 * Gen Name Human element class.
 *
 * @export
 * @class GenNamePascal
 */
import { bindable } from "aurelia-templating";

export class GenNamePascal {
    /**
     * Bindable value for the element.
     * @type {string}
     */
    @bindable
    public value: string;

    /**
     * Element value has changed.
     * @param {any} newValue
     * @param {any} oldValue
     * @returns {void}
     */
    public valueChanged(newValue: string, oldValue: string): void {
    }
}
