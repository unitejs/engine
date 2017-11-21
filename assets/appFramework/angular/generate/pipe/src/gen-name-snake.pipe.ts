/**
 * Gen Name Human pipe class.
 *
 * @export
 * @class GenNamePascalPipe
 */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "genNameCamel"
})
export class GenNamePascalPipe implements PipeTransform {
    /**
     * Transform the item.
     * @param {*} value
     * @param {*} [args]
     * @returns {*}
     */
    public transform(value: any, args?: any): any {
        return null;
    }
}
