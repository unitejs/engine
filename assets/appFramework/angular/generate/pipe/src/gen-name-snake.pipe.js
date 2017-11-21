/**
 * Gen Name Human pipe class.
 *
 * @export
 * @class GenNamePascalPipe
 */
import {Pipe} from "@angular/core";

@Pipe({
    name: "genNameCamel"
})
export class GenNamePascalPipe {
    /**
     * Transform the item.
     * @param {*} value
     * @param {*} [args]
     * @returns {*}
     */
    transform(value, args) {
        return null;
    }
}
