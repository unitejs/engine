/**
 * Gen Name Human value converter class.
 *
 * @export
 * @class GenNamePascalValueConverter
 */
export class GenNamePascalValueConverter {
    /**
     * Convert the value to a view.
     * @param {any} value
     * @returns {string}
     */
    public toView(value: any): string {
        return value ? value.toString() : "";
    }

    /**
     * Convert the value from a view.
     * @param {string} view
     * @returns {any}
     */
    public fromView(view: string): any {
    }
}
