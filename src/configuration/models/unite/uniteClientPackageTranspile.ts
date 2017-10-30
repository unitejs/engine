/**
 * Model of Unite Configuration (unite.json) tranpile options.
 */
export class UniteClientPackageTranspile {
    public alias: string;
    public sources?: string[];
    public language?: string;
    public modules?: string[];
    public stripExt?: boolean;
    public transforms?: { [id: string]: string };
}
